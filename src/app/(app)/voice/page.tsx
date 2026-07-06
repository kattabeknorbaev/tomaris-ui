"use client";

import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mic, Square } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

export default function VoicePage() {
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [language, setLanguage] = useState("uz");
  const { t } = useI18n();
  const reducedMotion = useReducedMotion();

  // Pre-compute deterministic wave heights to avoid Math.random in render
  const waveHeights = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => {
        const seed = (i * 7 + 13) % 37;
        return [4, (seed % 35) + 8, (seed % 18) + 4, (seed % 30) + 8, 4];
      }),
    []
  );

  const handleRecord = () => {
    if (recording) {
      setRecording(false);
      setHasRecording(true);
    } else {
      setRecording(true);
      setHasRecording(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{t.voicePage.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.voicePage.subtitle}
          </p>
        </div>

        {/* Language Selector */}
        <div className="mb-8 flex justify-center gap-2">
          {[
            { code: "uz", label: "O'zbek" },
            { code: "en", label: "English" },
            { code: "ru", label: "Русский" },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                language === lang.code
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Voice Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          {/* Mic Button */}
          <div className="relative">
            {recording && !reducedMotion && (
              <>
                <div className="absolute inset-0 -m-4 animate-ping rounded-full bg-primary/20 [animation-duration:2s]" aria-hidden="true" />
                <div className="absolute inset-0 -m-8 animate-ping rounded-full bg-primary/10 [animation-duration:2.5s]" aria-hidden="true" />
              </>
            )}
            <button
              onClick={handleRecord}
              className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all ${
                recording
                  ? "bg-error text-white shadow-lg shadow-error/30"
                  : "bg-primary text-on-primary shadow-lg shadow-primary/30 hover:bg-primary-deep"
              }`}
              aria-label={recording ? "Stop recording" : "Start recording"}
            >
              {recording ? (
                <Square className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {recording
              ? t.voicePage.listening
              : hasRecording
              ? t.voicePage.complete
              : t.voicePage.tapStart}
          </p>

          {/* Waveform Visualization */}
          {recording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex items-end gap-1 h-12"
            >
              {waveHeights.map((heights, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  style={reducedMotion ? { height: heights[1] } : undefined}
                  animate={reducedMotion ? undefined : { height: heights }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.04,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Transcript */}
          {hasRecording && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 w-full space-y-4"
            >
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Mic className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{t.voicePage.youSaid}:</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  O&apos;zbekiston haqida qisqacha ma&apos;lumot bering. Poytaxti
                  qayerda va aholisi qancha?
                </p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                    T
                  </span>
                  <span className="text-sm font-semibold">{t.voicePage.tomariSays}:</span>
                </div>
                <p className="text-sm leading-relaxed">
                  O&apos;zbekiston poytaxti — Toshkent shahri. Mamlakat aholisi
                  36 milliondan ortiq. O&apos;zbekiston Markaziy Osiyoning eng
                  ko&apos;p aholisi yashaydigan mamlakatlaridan biri hisoblanadi.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
