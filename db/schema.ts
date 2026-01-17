import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Chats table
 * One row = one conversation
 */
export const chats = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id").notNull(),

  title: text("title").notNull().default("New Chat"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});

/**
 * Messages table
 * One row = one message inside a chat
 */
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, {
      onDelete: "cascade",
    }),

  role: text("role").notNull(), // 'user' | 'assistant'

  content: text("content").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});
