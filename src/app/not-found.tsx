import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Image src="/logo.png" alt="Tomaris" width={40} height={40} className="rounded-md mb-6" />
      <p className="text-eyebrow mb-3">404</p>
      <h1 className="text-heading-1 text-ink">Page not found</h1>
      <p className="mt-3 text-body text-muted-foreground max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/home"
          className="rounded-md bg-primary px-5 py-2.5 text-body-sm font-semibold text-on-primary hover:bg-primary-deep active:scale-[0.98] transition-all duration-150"
        >
          Back to home
        </Link>
        <Link
          href="/app"
          className="rounded-md border border-border px-5 py-2.5 text-body-sm font-semibold text-ink hover:bg-surface-2 transition-colors duration-150"
        >
          Open chat
        </Link>
      </div>
    </div>
  );
}
