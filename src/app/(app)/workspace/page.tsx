"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  FileImage,
  FileSpreadsheet,
  Presentation,
  Trash2,
  Search,
} from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

const mockFiles = [
  {
    id: "1",
    name: "Business_Plan_2025.pdf",
    type: "pdf",
    size: "2.4 MB",
    date: "Jun 20, 2025",
    status: "ready" as const,
  },
  {
    id: "2",
    name: "Contract_Uzbek.docx",
    type: "docx",
    size: "856 KB",
    date: "Jun 18, 2025",
    status: "ready" as const,
  },
  {
    id: "3",
    name: "Presentation_Q3.pptx",
    type: "pptx",
    size: "5.1 MB",
    date: "Jun 15, 2025",
    status: "processing" as const,
  },
  {
    id: "4",
    name: "Financial_Report.xlsx",
    type: "xlsx",
    size: "1.2 MB",
    date: "Jun 10, 2025",
    status: "ready" as const,
  },
];

const iconMap: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: FileText,
  pptx: Presentation,
  xlsx: FileSpreadsheet,
  image: FileImage,
};

export default function WorkspacePage() {
  const [dragOver, setDragOver] = useState(false);
  const { t } = useI18n();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t.workspacePage.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.workspacePage.subtitle}
          </p>
        </div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          className={`mb-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Upload className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-medium">
            {t.workspacePage.dropHere}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t.workspacePage.fileTypes}
          </p>
          <button className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-emerald-dark">
            {t.workspacePage.chooseFiles}
          </button>
        </motion.div>

        {/* Files List */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold">{t.workspacePage.uploadedFiles}</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.workspacePage.searchFiles}
                className="rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="divide-y divide-border">
            {mockFiles.map((file) => {
              const Icon = iconMap[file.type] || FileText;
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
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
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      file.status === "ready"
                        ? "bg-primary/10 text-primary"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {file.status === "ready" ? t.workspacePage.ready : t.workspacePage.processing}
                  </span>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
