import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

/**
 * The database schema — the shape of our data.
 *
 * Each `pgTable(...)` is one table in Postgres. We describe the columns
 * here in TypeScript, and Drizzle turns this into real SQL tables for us.
 *
 * Two tables for now: a `chats` table, and a `messages` table where every
 * message belongs to one chat. The user/session tables come from Better
 * Auth in Phase 2 — that's why `userId` below is just a plain column for
 * now, with the foreign key to be added once the users table exists.
 */

export const chats = pgTable("chats", {
  // A text id (we generate UUIDs in the app, same as today's crypto.randomUUID).
  id: text("id").primaryKey(),
  // Which account owns this chat. Delete the user -> delete their chats.
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("New Chat"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  // Every message points at its parent chat. `onDelete: "cascade"` means:
  // delete a chat -> its messages are automatically deleted too.
  chatId: text("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // "user" | "assistant"
  content: text("content").notNull().default(""),
  reasoning: text("reasoning"), // optional — the model's <think> trace
  fileContext: text("file_context"), // extracted text of attached files
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// In-app feedback. Sent to the team by email AND stored here so the admin
// dashboard can show real counts and recent notes. Feedback can be anonymous
// (from a public marketing page), so userId/email are nullable; deleting a
// user keeps their feedback but nulls the link.
export const feedback = pgTable("feedback", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  email: text("email"), // reply-to hint, when known
  sentiment: text("sentiment"), // "positive" | "neutral" | "negative" | null
  message: text("message").notNull(),
  page: text("page"), // where it was sent from, for context
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
