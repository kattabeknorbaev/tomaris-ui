import { redirect } from "next/navigation";

// Email-OTP login handles both new and returning users in one flow, so there's
// no separate signup form — send anyone here straight to the login screen.
export default function SignupPage() {
  redirect("/login");
}
