import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * The database client. Anywhere in the app we want to talk to Postgres,
 * we `import { db } from "@/lib/db"` and call e.g. db.select()... .
 *
 * `neon(...)` opens a connection to your Neon database using the secret
 * connection string in DATABASE_URL (which lives in .env.local, never in git).
 */
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
