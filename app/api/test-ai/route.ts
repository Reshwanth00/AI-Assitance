import { NextResponse } from "next/server";
import { generateText } from "ai";
import { huggingface } from "@ai-sdk/huggingface";

export async function GET() {
  const result = await generateText({
    model: huggingface("meta-llama/Meta-Llama-3-8B-Instruct"),
    prompt: "Say hello in one sentence",
  });

  return NextResponse.json({ text: result.text });
}
