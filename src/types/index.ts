export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
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

export type ModelType = "tomaris-27b" | "tomaris-fast" | "tomaris-code";

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
