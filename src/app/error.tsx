"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-eyebrow mb-3">Error</p>
      <h1 className="text-heading-1 text-ink">Something went wrong</h1>
      <p className="mt-3 text-body text-muted-foreground max-w-md">
        An unexpected error occurred. Try again, or come back in a moment.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-5 py-2.5 text-body-sm font-semibold text-on-primary hover:bg-primary-deep active:scale-[0.98] transition-all duration-150"
        >
          Try again
        </button>
        <Link
          href="/home"
          className="rounded-md border border-border px-5 py-2.5 text-body-sm font-semibold text-ink hover:bg-surface-2 transition-colors duration-150"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
