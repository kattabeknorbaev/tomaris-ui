"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SocialButtons } from "@/components/auth/social-buttons";
import { useI18n } from "@/components/shared/i18n-provider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupClient() {
  const { t } = useI18n();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    terms?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = t.auth.nameRequired;
    if (!EMAIL_RE.test(email)) next.email = t.auth.emailInvalid;
    if (password.length < 8) next.password = t.auth.passwordTooShort;
    if (!agreed) next.terms = t.auth.termsRequired;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Demo: no auth backend yet — drop straight into the product.
    setSubmitting(true);
    setTimeout(() => router.push("/app"), 600);
  };

  return (
    <AuthLayout>
      <h1 className="mt-10 text-heading-2">{t.auth.createAccount}</h1>
      <p className="mt-2 text-body-sm text-muted-foreground">
        {t.auth.signupSubtitle}
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="signup-name" className="text-body-sm font-medium">
            {t.auth.fullName}
          </label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aziza Karimova"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "signup-name-error" : undefined}
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-body-sm outline-none transition-colors focus:border-ring aria-invalid:border-error"
            />
          </div>
          {errors.name && (
            <p id="signup-name-error" className="mt-1.5 text-caption text-error normal-case">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-email" className="text-body-sm font-medium">
            {t.common.email}
          </label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "signup-email-error" : undefined}
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-body-sm outline-none transition-colors focus:border-ring aria-invalid:border-error"
            />
          </div>
          {errors.email && (
            <p id="signup-email-error" className="mt-1.5 text-caption text-error normal-case">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-password" className="text-body-sm font-medium">
            {t.common.password}
          </label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "signup-password-error" : "signup-password-hint"}
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
          {errors.password ? (
            <p id="signup-password-error" className="mt-1.5 text-caption text-error normal-case">
              {errors.password}
            </p>
          ) : (
            <p id="signup-password-hint" className="mt-1.5 text-caption text-muted-foreground normal-case">
              {t.auth.passwordHint}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-2 text-body-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--primary)]"
            />
            <span className="text-muted-foreground">
              {t.auth.agreePrefix}{" "}
              <Link href="/security" className="text-foreground underline underline-offset-2">
                {t.auth.terms}
              </Link>{" "}
              {t.auth.and}{" "}
              <Link href="/security" className="text-foreground underline underline-offset-2">
                {t.auth.privacyPolicy}
              </Link>
              {t.auth.agreeSuffix}
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1.5 text-caption text-error normal-case">{errors.terms}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-lift flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-on-primary shadow-[0_4px_16px_-6px_rgba(15,143,111,0.5)] hover:bg-primary-deep disabled:opacity-60 disabled:pointer-events-none"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {submitting ? t.auth.creatingAccount : t.auth.createAccountCta}
        </button>

        <SocialButtons />
      </form>

      <p className="mt-6 text-center text-body-sm text-muted-foreground">
        {t.auth.haveAccount}{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-2"
        >
          {t.auth.signIn}
        </Link>
      </p>
    </AuthLayout>
  );
}
