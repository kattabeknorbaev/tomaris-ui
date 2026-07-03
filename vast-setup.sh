#!/bin/bash
set -e

echo "=========================================="
echo "  Tomaris AI — Vast.ai Setup"
echo "  GPU: 1x RTX PRO 6000 (Blackwell, 96GB)"
echo "  Model: Tomaris/Tomaris.ai (27B, Qwen3.5)"
echo "=========================================="

# --- Config ---
HF_TOKEN="${HF_TOKEN:?set HF_TOKEN env var}"
MODEL_REPO="Tomaris/Tomaris.ai"
SERVED_NAME="tomaris"
PORT=8000

echo "[1/6] Installing uv (fast pip replacement) ..."
pip install --quiet --upgrade pip
pip install --quiet uv

echo "[2/6] Creating venv + installing vLLM (Blackwell needs cu130) ..."
# --torch-backend=auto selects the CUDA build matching this machine (CUDA 13.x -> cu130 wheel).
uv venv --python 3.12 /opt/tomaris-venv
source /opt/tomaris-venv/bin/activate
uv pip install -U vllm --torch-backend=auto
uv pip install huggingface-hub

echo "[3/6] Logging into HuggingFace ..."
huggingface-cli login --token "$HF_TOKEN" --add-to-git-credential

echo "[4/6] Pre-downloading model (private, ~54GB, 2 shards) ..."
python -c "
from huggingface_hub import snapshot_download
snapshot_download(repo_id='$MODEL_REPO', local_files_only=False)
" 2>&1 | tail -3 || echo "  (pre-download skipped — vLLM will fetch on serve)"

echo "[5/6] Starting vLLM server ..."
echo "  model        : $MODEL_REPO"
echo "  served-name  : $SERVED_NAME"
echo "  gpu          : 1x RTX PRO 6000 (tensor-parallel-size 1)"
echo "  port         : $PORT"
echo "  language-only: yes (skips vision tower — config is the multimodal wrapper)"
echo "  reasoning    : qwen3 parser (delta.reasoning_content)"
echo "=========================================="

# --- Serve ---
# Why these flags:
#   --language-model-only   : skip the vision tower (text-only checkpoint wrapped as
#                             Qwen3_5ForConditionalGeneration). Fixes vLLM #39231.
#   --reasoning-parser qwen3 : split <think>...</think> into delta.reasoning_content
#                              (the UI surfaces it in a collapsible block).
#   --enable-prefix-caching  : recommended by the official Qwen3.5 recipe.
#   --tensor-parallel-size 1 : single 96GB GPU holds 27B bf16 (~54GB) + KV cache.
exec vllm serve "$MODEL_REPO" \
  --tensor-parallel-size 1 \
  --language-model-only \
  --dtype bfloat16 \
  --max-model-len 8192 \
  --max-num-seqs 256 \
  --port "$PORT" \
  --host 0.0.0.0 \
  --served-model-name "$SERVED_NAME" \
  --reasoning-parser qwen3 \
  --enable-prefix-caching \
  --gpu-memory-utilization 0.92
