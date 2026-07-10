# Tomaris — Image Support Roadmap

How to get from "text and documents" (today) to real image understanding,
without breaking the working deployment. Written 2026-07 against the current
stack: Tomaris 27B (Qwen3.5 fine-tune) on a rented H200 via vLLM, served
**text-only** (`--language-model-only` + converted `config.json`).

> **Golden rule:** the current model server works — never experiment on it.
> Vision work happens on a *separate* rented instance until proven, then the
> production instance is switched over in one planned move.

---

## Where we are (Phase 0 — shipped)

- Attachments already work for **text, code, CSV/JSON, and digital PDFs**:
  content is extracted in the browser and fed to the model (`file-extract.ts`).
- Images are rejected with an honest toast, because a text-only model cannot
  see. Everything below is about removing that limitation.

---

## Phase 1 — OCR: make images useful *this month* (no new GPU)

Most real "image" uploads in our market are **photos of documents** —
contracts, passports, homework, receipts. Those don't need a vision model;
they need OCR (text recognition), and the extracted text flows into the
existing pipeline exactly like a PDF does.

**Plan (2–4 days of work):**
1. Add [tesseract.js](https://github.com/naptha/tesseract.js) client-side with
   the `uzb`, `uzb_cyrl`, `rus`, `eng` trained data (loaded lazily, like pdf.js).
2. In `file-extract.ts`, route images → OCR → extracted text (same caps).
3. Also route **scanned PDFs** (pages with no text layer) through OCR.
4. UI copy: chip says "reading text from image…" — honest about what it does.

**Limits to disclose:** OCR reads printed text well, handwriting poorly; it
describes nothing visual (no "what's in this photo"). It's document
intelligence, not vision — but it covers the most valuable enterprise use
case (Uzbek document processing) at zero infra cost.

---

## Phase 2 — Real vision: serve a vision-language model (the main event)

Two viable routes. **Test A first; B is the fallback.**

### Option A — wake up our own checkpoint's vision tower
The Tomaris HF repo is a Qwen3.5 **multimodal wrapper** — we serve it
text-only today, but the vision components may be present in the weights.
If they are, our own brand model becomes multimodal with zero training.

Test procedure (~$50–100 of episodic GPU time, 1–2 days):
1. Rent a **separate** H200/A100 instance (do NOT touch production).
2. Copy the HF repo to a new branch/repo with the **original multimodal
   `config.json`** (the pre-conversion one — production keeps the converted one).
3. Latest vLLM; serve **without** `--language-model-only`.
4. Smoke test: OpenAI-format request with an image
   (`content: [{type:"image_url", image_url:{url:"data:image/jpeg;base64,…"}}, {type:"text", …}]`).
5. Evaluate honestly: does it caption/read/reason in Uzbek? The vision tower
   was not part of our SFT, so Uzbek visual grounding may be weak — measure
   before promising anything.

VRAM math: 27B bf16 ≈ 54 GB + vision encoder a few GB + KV cache → one H200
(141 GB) still fits comfortably.

### Option B — a second, smaller VLM as the "eyes"
If A fails (missing weights, vLLM incompatibility, poor quality):
serve a compact open VLM (Qwen-VL 7–8B class) alongside Tomaris:

    image → small VLM (describe/OCR, any language) → text → Tomaris 27B (reason + answer in Uzbek)

- Pros: cheap to iterate, production model untouched, each part replaceable.
- Cons: two hops (slower), visual nuance lost in translation between models.
- Extra VRAM: ~16–20 GB → fits next to the 27B on the H200, or on a cheap
  second GPU (~$0.3–0.6/hr class).

### App changes (either option, ~2–3 days, most already staged)
- `/api/chat`: accept OpenAI *content-parts* messages (text + image_url).
- `chat-input.tsx`: accept images again → downscale client-side (~1024px,
  JPEG ~80%) → base64 data URL → send as an image part. Preview thumbnail chip.
- DB: images themselves are NOT stored initially (only the conversation) —
  add object storage (S3-compatible) later if image history must persist.
- Rate-limit image messages from day one — vision requests are heavier.

---

## Phase 3 — the moat move: Uzbek visual fine-tuning (quarter-scale)

Global VLMs are as weak at Uzbek visual context as LLMs were at Uzbek text —
same playbook applies:
1. Collect Uzbek visual data: document photos, signage, handwriting,
   receipts, cultural imagery — annotated by the Tashkent team.
2. Instruction-tune the VL model (whichever won in Phase 2) on it.
3. Extend the 300-prompt benchmark with an **Uzbek visual QA track**.

That turns "we support images" into "we own the only Uzbek visual-language
dataset" — same story as the 75K SFT lines, one modality over.

---

## Cost & sequencing summary

| Phase | What users get | Infra cost | Effort |
|-------|----------------|-----------|--------|
| 1. OCR | Photos of documents work | $0 (client-side) | 2–4 days |
| 2. VLM | True image understanding | ~$0 test → +$0–1.7K/mo live | 1–2 weeks |
| 3. FT  | Best-in-world Uzbek vision | training runs (episodic) | a quarter |

Recommended order: **1 now → 2A test when there's a free weekend → decide
2A vs 2B on evidence → 3 after the raise** (it's a strong use-of-funds line).
