"use server";

import { db } from "@/db";
import { chats } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function createChat() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const [chat] = await db
    .insert(chats)
    .values({
      userId: session.user.email,
      title: "New Chat",
    })
    .returning();

  return chat;
}

export async function getUserChats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  return db
    .select()
    .from(chats)
    .where(eq(chats.userId, session.user.email))
    .orderBy(desc(chats.updatedAt));
}
