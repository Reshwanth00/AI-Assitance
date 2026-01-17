import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateText } from "ai";
import { huggingface } from "@ai-sdk/huggingface";

// =====================
// GET: Fetch chat history
// =====================
export async function GET(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(asc(messages.createdAt));

  return NextResponse.json(data);
}

// =====================
// POST: Send message + get AI reply
// =====================
export async function POST(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages: incomingMessages } = await req.json();

  if (!incomingMessages?.length) {
    return NextResponse.json(
      { error: "Missing messages" },
      { status: 400 }
    );
  }

  const lastUserMessage =
    incomingMessages[incomingMessages.length - 1];

  // 1️⃣ Save user message
  await db.insert(messages).values({
    chatId,
    role: "user",
    content: lastUserMessage.content,
  });

  // 2️⃣ Generate AI response
  const prompt = incomingMessages
    .filter((m: any) => m.role === "user")
    .map((m: any) => m.content)
    .join("\n");

  const result = await generateText({
    model: huggingface("meta-llama/Meta-Llama-3-8B-Instruct"),
    prompt,
  });

  const aiText = result.text;

  // 3️⃣ Save AI message
  await db.insert(messages).values({
    chatId,
    role: "assistant",
    content: aiText,
  });

  // 4️⃣ Return AI response
  return NextResponse.json({ content: aiText });
}
