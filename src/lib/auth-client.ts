import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

// The client-side counterpart. Components import from here to trigger login,
// read the current session, sign out, etc. e.g.
//   authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" })
//   authClient.signIn.emailOtp({ email, otp })
//   authClient.useSession()
export const authClient = createAuthClient({
  // Auth lives on the host the app is actually served from. This pointed at
  // www.tomaris.ai while www and chat were the same deployment -- once
  // tomaris.ai/www serve the landing page instead, /api/auth/* stops existing
  // there and every login and session call fails silently.
  // auth.ts already trusts all three origins and scopes the cookie to
  // .tomaris.ai, so same-origin here is both correct and avoids CORS entirely.
  baseURL: process.env.NODE_ENV === "development" ? undefined : "https://chat.tomaris.ai",
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, useSession } = authClient;
