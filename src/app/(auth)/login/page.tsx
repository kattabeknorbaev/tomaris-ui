import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Tomaris account.",
  robots: { index: false },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
