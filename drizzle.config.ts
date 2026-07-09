import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit is a command-line tool, so (unlike the Next.js app) it doesn't
// automatically read .env.local — we load it explicitly here.
config({ path: ".env.local" });

export default defineConfig({
  schema: ["./src/lib/db/schema.ts", "./src/lib/db/auth-schema.ts"],
  out: "./drizzle", // where migration SQL files get written
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
