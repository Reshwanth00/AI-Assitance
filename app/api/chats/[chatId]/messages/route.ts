import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, asc, desc, lt, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateText } from "ai";
import { huggingface } from "@ai-sdk/huggingface";

import {
  getWeather,
  getF1Matches,
  getStockPrice,
} from "@/lib/tools";

/* -----------------------------
   🔧 Helper functions
------------------------------ */

function extractStockSymbol(text: string) {
  const companyMap: Record<string, string> = {
    apple: "AAPL",
    tesla: "TSLA",
    microsoft: "MSFT",
    google: "GOOGL",
    amazon: "AMZN",
    meta: "META",
  };

  const lower = text.toLowerCase();

  for (const name in companyMap) {
    if (lower.includes(name)) {
      return companyMap[name];
    }
  }

  const match = text.match(/\b[A-Z]{2,5}\b/);
  return match ? match[0] : null;
}

function extractLocation(text: string) {
  const match = text.match(/in\s+([A-Za-z\s]+)/i);
  return match ? match[1].trim() : null;
}

/* -----------------------------
   🔒 SYSTEM PROMPT
------------------------------ */

const SYSTEM_PROMPT = `
You are a conversational AI assistant.

You may optionally call a tool if required.

Available tools:
1. getWeather(location: string)
2. getF1Matches()
3. getStockPrice(symbol: string)

RULES:
- If a tool is required, respond ONLY with valid JSON.
- If no tool is required, respond with natural conversational text.
- NEVER explain your reasoning.
- NEVER mention tools unless calling them.
- NEVER say "no tool is needed".

Tool JSON format:

{
  "tool": "getWeather | getF1Matches | getStockPrice",
  "arguments": { ... }
}
`;


/* =====================
   GET: Fetch messages
===================== */
export async function GET(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await context.params;
  const { searchParams } = new URL(req.url);

  const cursor = searchParams.get("cursor"); // ISO timestamp
  const limit = Number(searchParams.get("limit") ?? 20);

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Build WHERE condition safely
  const whereCondition = cursor
    ? and(
        eq(messages.chatId, chatId),
        lt(messages.createdAt, new Date(cursor))
      )
    : eq(messages.chatId, chatId);

  const data = await db
    .select()
    .from(messages)
    .where(whereCondition)
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  return NextResponse.json({
    messages: data.reverse(), // oldest → newest
    hasMore: data.length === limit,
  });
}



/* =====================
   POST: Chat + Tools
===================== */
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
    return NextResponse.json({ error: "Missing messages" }, { status: 400 });
  }

  const lastUserMessage = incomingMessages[incomingMessages.length - 1];

  /* 1️⃣ Save USER message */
  await db.insert(messages).values({
    chatId,
    role: "user",
    content: lastUserMessage.content,
  });

  /* 2️⃣ Ask AI */
  const result = await generateText({
    model: huggingface("meta-llama/Meta-Llama-3-8B-Instruct"),
    prompt: `
${SYSTEM_PROMPT}

User message:
"${lastUserMessage.content}"
`,
  });

  console.log("AI RAW RESPONSE:", result.text);

  /* 3️⃣ Parse AI response */
  let parsed: any;
  try {
    parsed = JSON.parse(result.text);
  } catch {
    // Normal text response
    await db.insert(messages).values({
      chatId,
      role: "assistant",
      content: result.text,
    });

    return NextResponse.json({ content: result.text });
  }

  console.log("AI PARSED JSON:", parsed);

  /* 4️⃣ Execute tool */
  let finalResponse: any;

  if (parsed.tool === "getWeather") {
    const location =
      parsed.arguments?.location ||
      extractLocation(lastUserMessage.content);

    finalResponse = location
      ? await getWeather(location)
      : { type: "error", message: "Location not found" };
  }

  else if (parsed.tool === "getF1Matches") {
    finalResponse = await getF1Matches();
  }

  else if (parsed.tool === "getStockPrice") {
    const symbol =
      parsed.arguments?.symbol ||
      extractStockSymbol(lastUserMessage.content);

    finalResponse = symbol
      ? await getStockPrice(symbol)
      : { type: "error", message: "Stock symbol not found" };
  }

  else {
    finalResponse = { type: "error", message: "Invalid tool call" };
  }

  console.log("FINAL TOOL RESPONSE:", finalResponse);

  /* 5️⃣ Save AI/tool response */
  await db.insert(messages).values({
    chatId,
    role: "assistant",
    content: JSON.stringify(finalResponse),
  });

  /* 6️⃣ Return response */
  return NextResponse.json({ content: finalResponse });
}
