"use client";

import Link from "next/link";
import { TomarisMark } from "@/components/shared/tomaris-mark";
import { useI18n } from "@/components/shared/i18n-provider";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="t-avatar mb-6 h-11 w-11"><TomarisMark size={20} /></span>
      <p className="text-eyebrow mb-3">404</p>
      <h1 className="text-heading-1 text-ink">{t.common.pageNotFound}</h1>
      <p className="mt-3 text-body text-muted-foreground max-w-md">
        {t.common.pageNotFoundDesc}
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/"
          className="t-btn-primary h-11 px-5 text-[15px]"
        >
          {t.common.backToHome}
        </Link>
        <Link
          href={process.env.NODE_ENV === "development" ? "/app" : "https://chat.tomaris.ai"}
          className="t-btn-secondary h-11 px-5 text-[15px]"
        >
          {t.common.openChat}
        </Link>
      </div>
    </div>
  );
}
