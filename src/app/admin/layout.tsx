import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Founders only (ADMIN_EMAILS env var). Everyone else goes to the app.
  const admin = await requireAdmin();
  if (!admin) redirect("/app");

  return children;
}
