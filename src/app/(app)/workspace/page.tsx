"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  FileImage,
  FileSpreadsheet,
  Presentation,
  Trash2,
  Search,
  FolderOpen,
} from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";
import { generateId } from "@/lib/utils";

const PROCESSING_DELAY_MS = 2500;

interface WorkspaceFile {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  status: "ready" | "processing";
}

const initialFiles: WorkspaceFile[] = [
  {
    id: "1",
    name: "Business_Plan_2025.pdf",
    type: "pdf",
    size: "2.4 MB",
    date: "Jun 20, 2025",
    status: "ready",
  },
  {
    id: "2",
    name: "Contract_Uzbek.docx",
    type: "docx",
    size: "856 KB",
    date: "Jun 18, 2025",
    status: "ready",
  },
  {
    id: "3",
    name: "Presentation_Q3.pptx",
    type: "pptx",
    size: "5.1 MB",
    date: "Jun 15, 2025",
    status: "ready",
  },
  {
    id: "4",
    name: "Financial_Report.xlsx",
    type: "xlsx",
    size: "1.2 MB",
    date: "Jun 10, 2025",
    status: "ready",
  },
];

const iconMap: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: FileText,
  pptx: Presentation,
  xlsx: FileSpreadsheet,
  image: FileImage,
};

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileType(name: string, mime: string): string {
  if (mime.startsWith("image/")) return "image";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return ext in iconMap ? ext : "pdf";
}

export default function WorkspacePage() {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<WorkspaceFile[]>(initialFiles);
  const [query, setQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, locale } = useI18n();

  const visibleFiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, query]);

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const added: WorkspaceFile[] = Array.from(list).map((file) => ({
      id: generateId(),
      name: file.name,
      type: fileType(file.name, file.type),
      size: formatSize(file.size),
      date: new Date().toLocaleDateString(locale === "en" ? "en-US" : locale === "ru" ? "ru-RU" : "uz-UZ", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "processing",
    }));
    setFiles((prev) => [...added, ...prev]);
    // Demo: flip to ready after a short delay — no upload backend yet.
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          added.some((a) => a.id === f.id) ? { ...f, status: "ready" } : f
        )
      );
    }, PROCESSING_DELAY_MS);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t.workspacePage.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.workspacePage.subtitle}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.csv,.json,.md,.png,.jpg,.jpeg,.webp,.pptx,.xlsx"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`mb-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Upload className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm font-medium">
            {t.workspacePage.dropHere}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t.workspacePage.fileTypes}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-on-primary transition-all hover:bg-primary-deep active:scale-[0.98]"
          >
            {t.workspacePage.chooseFiles}
          </button>
        </motion.div>

        {/* Files List */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <h2 className="font-semibold">{t.workspacePage.uploadedFiles}</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.workspacePage.searchFiles}
                aria-label={t.workspacePage.searchFiles}
                className="rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          {visibleFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <FolderOpen className="h-8 w-8 text-mute" aria-hidden="true" />
              <p className="mt-3 text-sm text-muted-foreground">
                {query ? `${t.workspacePage.noMatches} "${query}"` : t.workspacePage.empty}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {visibleFiles.map((file) => {
                const Icon = iconMap[file.type] || FileText;
                return (
                  <li
                    key={file.id}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {file.size} · {file.date}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        file.status === "ready"
                          ? "bg-primary/10 text-primary"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {file.status === "ready" ? t.workspacePage.ready : t.workspacePage.processing}
                    </span>
                    <button
                      onClick={() => deleteFile(file.id)}
                      aria-label={`${t.common.delete}: ${file.name}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
