/**
 * One statute the answer was grounded in.
 *
 * The backend retrieves these, then audits every `N-modda` the model wrote
 * against the articles it actually supplied — an invented article number
 * cannot survive that check. They arrive on the final SSE frame and are the
 * difference between a chatbot and a legal tool, so they get rendered.
 */
export interface Citation {
  /** Corpus slug, e.g. "mehnat_kodeksi". */
  code: string;
  /** Human name, e.g. "Oʻzbekiston Respublikasining Mehnat kodeksi". */
  code_title?: string;
  /** Display form, e.g. "253-modda" or "141²-modda". */
  article: string;
  /** lex.uz document id, when the corpus recorded one. */
  lex_uz?: string;
}

/** Which path produced the answer — see the backend's retrieval_mode. */
export type RetrievalMode =
  | "deterministic"
  | "article-lookup"
  | "semantic"
  | "chat"
  | "identity"
  | "override";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  /** Statutes this answer was grounded in. Empty on chat/identity replies. */
  citations?: Citation[];
  retrievalMode?: RetrievalMode;
  /** Set when /health behind VAST_API_URL lacked the RAG shape (review #1 §4). */
  ragBackendMissing?: boolean;
  /** Extracted text of attached files — sent to the model, not rendered. */
  fileText?: string;
  /** ISO 8601 — stored as string so it survives localStorage persistence. */
  timestamp: string;
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  model: ModelType;
}

export type ModelType = "tomaris-27b";

export type Language = "uz" | "en" | "ru";

export type Theme = "dark" | "light";

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  systemPrompt: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: "processing" | "ready" | "error";
}
