"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

// On the public landing, quietly forward already-authenticated visitors to the
// app so returning users aren't slowed down. Crawlers and logged-out visitors
// are never redirected, so the homepage stays fully indexable and rankable.
export function LoggedInRedirect() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) router.replace("/app");
  }, [isPending, session, router]);

  return null;
}
