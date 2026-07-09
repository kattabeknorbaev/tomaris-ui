import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppShell } from "@/components/chat/app-shell";

export const metadata: Metadata = {
  title: "App",
  robots: { index: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The lock on the door: every route in this group (/app, /profile, /settings)
  // requires a valid session. No session -> off to /login. This runs on the
  // server before any app UI is sent, so there's no flash of protected content.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return <AppShell>{children}</AppShell>;
}
