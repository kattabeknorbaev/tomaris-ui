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
  trustedOrigins: ["https://tomaris.ai", "https://www.tomaris.ai"],

  // Better Auth stores users/sessions in our Neon database via Drizzle.
  database: drizzleAdapter(db, { provider: "pg" }),

  plugins: [
    // Passwordless login: user gets a 6-digit code by email, types it in.
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        // Built here (not at module load) so a missing key doesn't crash the
        // whole app — it only matters at the moment we actually send.
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject: "Your Tomaris verification code",
          text: `Your Tomaris verification code is ${otp}\n\nIt expires in 5 minutes. If you didn't request this, you can ignore this email.`,
        });
      },
    }),
    // Must be last — lets Better Auth set session cookies in Next.js.
    nextCookies(),
  ],
});
