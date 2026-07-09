import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// This single file handles every auth request — sending OTP codes, verifying
// them, creating sessions, signing out. Better Auth generates all those
// endpoints under /api/auth/* for us.
export const { GET, POST } = toNextJsHandler(auth);
