"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginClient() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1 — send the 6-digit code to the entered email.
  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    setLoading(false);
    if (error) {
      setError(error.message || "Couldn't send the code. Please try again.");
      return;
    }
    toast.success("Code sent — check your email.");
    setStep("otp");
  };

  // Step 2 — verify the code. Creates the account if it's a new email,
  // logs in if it already exists. Either way, a real session is set.
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    const { error } = await authClient.signIn.emailOtp({ email, otp: otp.trim() });
    setLoading(false);
    if (error) {
      setError(error.message || "That code is invalid or expired.");
      return;
    }
    router.push("/app");
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-body-sm outline-none transition-colors focus:border-ring aria-invalid:border-error";

  return (
    <AuthLayout>
      {step === "email" ? (
        <>
          <h1 className="mt-10 text-heading-2">Welcome to Tomaris</h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a sign-in code.
          </p>

          <form className="mt-8 space-y-4" onSubmit={sendCode} noValidate>
            <div>
              <label htmlFor="login-email" className="text-body-sm font-medium">
                Email
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
                  aria-invalid={!!error}
                  autoFocus
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <p className="text-caption text-error normal-case">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-lift flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-on-primary shadow-[0_4px_16px_-6px_rgba(15,143,111,0.5)] hover:bg-primary-deep disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {loading ? "Sending…" : "Send code"}
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="mt-10 text-heading-2">Check your email</h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            We sent a 6-digit code to <span className="text-ink">{email}</span>.
          </p>

          <form className="mt-8 space-y-4" onSubmit={verifyCode} noValidate>
            <div>
              <label htmlFor="login-otp" className="text-body-sm font-medium">
                Verification code
              </label>
              <div className="relative mt-1.5">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="login-otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  aria-invalid={!!error}
                  autoFocus
                  className={`${inputClass} tracking-[0.4em] font-mono`}
                />
              </div>
            </div>

            {error && (
              <p className="text-caption text-error normal-case">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-lift flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-on-primary shadow-[0_4px_16px_-6px_rgba(15,143,111,0.5)] hover:bg-primary-deep disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {loading ? "Verifying…" : "Verify & continue"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError(null);
              }}
              className="flex w-full items-center justify-center gap-1.5 text-caption text-muted-foreground hover:text-ink transition-colors"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Use a different email
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
