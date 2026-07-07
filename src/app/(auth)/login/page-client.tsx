"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SocialButtons } from "@/components/auth/social-buttons";
import { useI18n } from "@/components/shared/i18n-provider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginClient() {
  const { t } = useI18n();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email)) next.email = t.auth.emailInvalid;
    if (password.length < 8) next.password = t.auth.passwordTooShort;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Demo: no auth backend yet — drop straight into the product.
    setSubmitting(true);
    setTimeout(() => router.push("/app"), 600);
  };

  return (
    <AuthLayout>
      <h1 className="mt-10 text-heading-2">{t.auth.welcomeBack}</h1>
      <p className="mt-2 text-body-sm text-muted-foreground">
        {t.auth.loginSubtitle}
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="login-email" className="text-body-sm font-medium">
            {t.common.email}
          </label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-body-sm outline-none transition-colors focus:border-ring aria-invalid:border-error"
            />
          </div>
          {errors.email && (
            <p id="login-email-error" className="mt-1.5 text-caption text-error normal-case">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-body-sm font-medium">
              {t.common.password}
            </label>
            <Link
              href="/contact"
              className="text-caption text-muted-foreground hover:text-foreground normal-case"
            >
              {t.auth.forgotPassword}
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-10 text-body-sm outline-none transition-colors focus:border-ring aria-invalid:border-error"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="login-password-error" className="mt-1.5 text-caption text-error normal-case">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-body-sm">
            <input type="checkbox" className="h-4 w-4 rounded border-border accent-[var(--primary)]" />
            <span className="text-muted-foreground">{t.auth.rememberMe}</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-lift flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-on-primary shadow-[0_4px_16px_-6px_rgba(15,143,111,0.5)] hover:bg-primary-deep disabled:opacity-60 disabled:pointer-events-none"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {submitting ? t.auth.signingIn : t.auth.signIn}
        </button>

        <SocialButtons />
      </form>

      <p className="mt-6 text-center text-body-sm text-muted-foreground">
        {t.auth.noAccount}{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline underline-offset-2"
        >
          {t.auth.signUp}
        </Link>
      </p>
    </AuthLayout>
  );
}
