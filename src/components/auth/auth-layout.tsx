"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/shared/i18n-provider";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { GirihFigure, TomarisLockup } from "@/components/shared/tomaris-mark";
import { GirihGround } from "@/components/ui/girih-ground";

const ENTER = [0.23, 1, 0.32, 1] as const;

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  // On chat.tomaris.ai, "/" is the app itself — the brand goes to the landing page.
  const homeHref = process.env.NODE_ENV === "development" ? "/" : "https://tomaris.ai";

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <GirihGround />

      <header className="relative z-10 px-[clamp(20px,5vw,64px)] pt-3">
        <div className="t-panel flex items-center justify-between rounded-2xl py-2 pl-4 pr-2.5">
          <a href={homeHref} className="flex min-h-11 items-center">
            <TomarisLockup />
          </a>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="relative z-10 grid flex-1 items-center gap-16 px-[clamp(20px,5vw,64px)] py-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.56, ease: ENTER }}
          className="mx-auto w-full max-w-[400px]"
        >
          {children}
        </motion.div>

        {/* Brand side — the landing page hero's construction figure */}
        <div className="hidden flex-col items-center gap-10 lg:flex">
          <GirihFigure className="w-[min(32vw,400px)]" />
          <div className="max-w-sm text-center">
            <h2 className="text-[clamp(26px,2.4vw,34px)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink [text-wrap:balance]">
              {t.auth.panelTitle}
            </h2>
            <p className="mt-3 text-[16px] leading-[1.5] text-mute">{t.auth.panelSubtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
