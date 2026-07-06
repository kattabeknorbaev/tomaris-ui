"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Sparkles, ImageIcon } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";
import { cn } from "@/lib/utils";

const ANALYZE_DELAY_MS = 2000;

interface SelectedImage {
  url: string;
  name: string;
  size: number;
  width: number;
  height: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VisionPage() {
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  // Release the object URL when the image changes or on unmount.
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.url);
    };
  }, [image]);

  const selectFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImage({
        url,
        name: file.name,
        size: file.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setAnalyzed(false);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }, []);

  const handleAnalyze = () => {
    setAnalyzing(true);
    // Demo: canned analysis after a realistic delay — vision backend not wired yet.
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, ANALYZE_DELAY_MS);
  };

  const clearImage = () => {
    setImage(null);
    setAnalyzed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t.visionPage.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.visionPage.subtitle}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => selectFile(e.target.files?.[0])}
        />

        {!image ? (
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
              selectFile(e.dataTransfer.files?.[0]);
            }}
            className={cn(
              "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            )}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ImageIcon className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-medium">
              {t.visionPage.dropHere}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.visionPage.fileTypes}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-on-primary transition-all hover:bg-primary-deep active:scale-[0.98]"
            >
              {t.visionPage.chooseImage}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex max-h-[420px] items-center justify-center bg-canvas-soft">
                {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                <img
                  src={image.url}
                  alt={image.name}
                  className="max-h-[420px] w-auto max-w-full object-contain"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <span className="min-w-0 truncate text-sm text-muted-foreground">
                  {image.name} · {image.width} × {image.height} · {formatSize(image.size)}
                </span>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={clearImage}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                  >
                    {t.visionPage.replace}
                  </button>
                  {!analyzed && (
                    <button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-on-primary transition-all hover:bg-primary-deep active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {analyzing ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-on-primary border-t-transparent" aria-hidden="true" />
                          {t.visionPage.analyzing}
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          {t.visionPage.analyze}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            {analyzed && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-primary/20 bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold">{t.visionPage.results}</span>
                </div>
                <p className="mb-4 text-xs text-muted-foreground">{t.visionPage.demoNote}</p>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">{t.visionPage.description}</h4>
                    <p className="text-muted-foreground">
                      The image shows a modern office workspace with a laptop, coffee mug,
                      and notebook on a wooden desk. Natural light comes from a window
                      on the left side.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{t.visionPage.objectsDetected}</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Laptop", "Coffee Mug", "Notebook", "Desk", "Window", "Plant"].map(
                        (obj) => (
                          <span
                            key={obj}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                          >
                            {obj}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{t.visionPage.textInImage}</h4>
                    <p className="text-muted-foreground">
                      No text detected in this image.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
