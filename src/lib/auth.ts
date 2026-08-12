import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { db } from "@/lib/db";

// Who the verification emails come from. Starts as Resend's test sender so we
// can test immediately; once tomaris.ai is verified in Resend, set EMAIL_FROM
// to "Tomaris <no-reply@tomaris.ai>" in .env.local and it switches over.
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Tomaris <onboarding@resend.dev>";

export const auth = betterAuth({
  // Accept requests from both the apex and www domains — the site serves on
  // www.tomaris.ai (apex redirects there), so browser logins come from www.
  trustedOrigins: ["https://tomaris.ai", "https://www.tomaris.ai", "https://chat.tomaris.ai"],

  // DB-backed rate limiting on the auth endpoints. Tight caps on the two
  // abuse-prone ones: sending codes (email-bomb / cost) and verifying (brute).
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/email-otp/send-verification-otp": { window: 60, max: 3 },
      "/sign-in/email-otp": { window: 60, max: 10 },
    },
  },

  // Better Auth stores users/sessions in our Neon database via Drizzle.
  database: drizzleAdapter(db, { provider: "pg" }),

  // Lets a signed-in user permanently delete their own account (Settings →
  // Delete Account). Their chats cascade-delete via the userId foreign key.
  user: {
    deleteUser: { enabled: true },
  },

  // Google OAuth — active only once GOOGLE_CLIENT_ID/SECRET are configured.
  // A Google login with the same (verified) email as an existing OTP account
  // links to that account instead of creating a duplicate.
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},

  plugins: [
    // Passwordless login: user gets a 6-digit code by email, types it in.
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        // Built here (not at module load) so a missing key doesn't crash the
        // whole app — it only matters at the moment we actually send.
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject: "Your Tomaris verification code",
          text: `Your Tomaris verification code is ${otp}\n\nIt expires in 5 minutes. If you didn't request this, you can ignore this email.`,
        });
        // Surface delivery failures — otherwise the user is told "code sent"
        // while nothing ever arrives.
        if (error) {
          console.error("OTP email failed:", error);
          throw new Error("Could not send the verification email. Please try again.");
        }
      },
    }),
    // Must be last — lets Better Auth set session cookies in Next.js.
    nextCookies(),
  ],
});
