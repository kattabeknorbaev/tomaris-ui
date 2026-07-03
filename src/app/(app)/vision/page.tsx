"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Sparkles, ImageIcon } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

export default function VisionPage() {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const { t } = useI18n();

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
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

        {!uploaded ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-16 hover:border-primary/30 transition-colors"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ImageIcon className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-medium">
              {t.visionPage.dropHere}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.visionPage.fileTypes}
            </p>
            <button
              onClick={() => setUploaded(true)}
              className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-emerald-dark"
            >
              {t.visionPage.chooseImage}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-muted to-gold/20 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    sample_image.jpg
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-muted-foreground">
                  1920 × 1080 · 2.4 MB
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUploaded(false);
                      setAnalyzed(false);
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                  >
                    {t.visionPage.replace}
                  </button>
                  {!analyzed && (
                    <button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-all hover:bg-emerald-dark disabled:opacity-50"
                    >
                      {analyzing ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          {t.visionPage.analyzing}
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-primary/20 bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{t.visionPage.results}</span>
                </div>
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
