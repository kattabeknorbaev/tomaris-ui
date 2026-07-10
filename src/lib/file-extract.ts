/**
 * Client-side file text extraction — what makes attachments real.
 * The extracted text is sent to the model alongside the user's message, so
 * Tomaris genuinely reads the file instead of just showing a filename chip.
 *
 * Supported today (text-only model on the backend):
 *   - plain text family: .txt .md .csv .json code files, etc.
 *   - PDF (digital, text-based) via pdf.js
 * Images are rejected honestly — the current model can't see.
 */

// Per-file and per-message caps keep us safely inside the model's context.
export const MAX_CHARS_PER_FILE = 12_000;
export const MAX_CHARS_TOTAL = 24_000;

const TEXT_EXTENSIONS = new Set([
  "txt", "md", "markdown", "csv", "tsv", "json", "jsonl", "xml", "yaml", "yml",
  "html", "css", "js", "jsx", "ts", "tsx", "py", "java", "c", "h", "cpp", "cs",
  "go", "rs", "rb", "php", "sql", "sh", "bat", "ini", "toml", "cfg", "log",
]);

export function fileKind(file: File): "text" | "pdf" | "image" | "unsupported" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (file.type.startsWith("text/") || TEXT_EXTENSIONS.has(ext)) return "text";
  return "unsupported";
}

async function extractPdf(file: File): Promise<string> {
  // Loaded on demand so pdf.js (heavy) never touches the initial bundle.
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  let out = "";
  for (let i = 1; i <= doc.numPages && out.length < MAX_CHARS_PER_FILE; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    out += pageText + "\n";
  }
  return out;
}

/** Extract readable text from a file, truncated to MAX_CHARS_PER_FILE. */
export async function extractFileText(file: File): Promise<string> {
  const kind = fileKind(file);
  let text: string;
  if (kind === "pdf") text = await extractPdf(file);
  else if (kind === "text") text = await file.text();
  else throw new Error(`Unsupported file type: ${file.name}`);

  // Strip null bytes (Postgres text rejects them) and normalize NBSP to space.
  text = text.replace(/\u0000/g, "").replace(/\u00a0/g, " ").trim();
  if (text.length > MAX_CHARS_PER_FILE) {
    text = text.slice(0, MAX_CHARS_PER_FILE) + "\n…[file truncated]";
  }
  return text;
}
