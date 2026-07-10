import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Tomaris account and start chatting with Uzbekistan's first native AI.",
  robots: { index: false },
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
