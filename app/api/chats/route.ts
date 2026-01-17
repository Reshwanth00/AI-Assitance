import { NextResponse } from "next/server";
import { db } from "@/db";
import { chats } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

/**
 * GET /api/chats
 * Get all chats for logged-in user
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const data = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, session.user.email))
    .orderBy(desc(chats.updatedAt));

  return NextResponse.json(data);
}

/**
 * POST /api/chats
 * Create a new chat
 */
export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const [chat] = await db
    .insert(chats)
    .values({
      userId: session.user.email,
      title: "New Chat",
    })
    .returning();

  return NextResponse.json(chat);
}


