import type { Metadata } from "next";
import SignupClient from "./page-client";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Tomaris account and start chatting with Uzbekistan's first native AI.",
  robots: { index: false },
};

export default function SignupPage() {
  return <SignupClient />;
}
