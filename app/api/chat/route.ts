import { generateText } from "ai";
import { huggingface } from "@ai-sdk/huggingface";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const prompt = messages
      .filter((m: any) => m.role === "user")
      .map((m: any) => m.content)
      .join("\n");

    const result = await generateText({
      model: huggingface("meta-llama/Meta-Llama-3-8B-Instruct"),
      prompt,
    });

    return Response.json({
      role: "assistant",
      content: result.text,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
