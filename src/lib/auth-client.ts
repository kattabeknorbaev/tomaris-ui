import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

// The client-side counterpart. Components import from here to trigger login,
// read the current session, sign out, etc. e.g.
//   authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" })
//   authClient.signIn.emailOtp({ email, otp })
//   authClient.useSession()
export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === "development" ? undefined : "https://www.tomaris.ai",
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, useSession } = authClient;
