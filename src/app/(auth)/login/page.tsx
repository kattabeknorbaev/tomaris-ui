import type { Metadata } from "next";
import LoginClient from "./page-client";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Tomaris account.",
  robots: { index: false },
};

export default function LoginPage() {
  return <LoginClient />;
}
