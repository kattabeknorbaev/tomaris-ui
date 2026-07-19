"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useI18n } from "@/components/shared/i18n-provider";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen">
      {/* Left side — form */}
      <div className="flex flex-1 flex-col justify-center px-5 py-10 sm:px-8 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Tomaris"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="text-base font-semibold tracking-tight">
              Tomaris
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Right side — brand panel */}
      <div className="relative hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-secondary">
        <div className="absolute inset-0 dot-grid" aria-hidden="true" />
        <div className="relative max-w-sm px-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-on-primary">
            <span className="text-2xl font-bold">T</span>
          </div>
          <h3 className="text-heading-2">{t.auth.panelTitle}</h3>
          <p className="mt-3 text-body text-muted-foreground">
            {t.auth.panelSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
