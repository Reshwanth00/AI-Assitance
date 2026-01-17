"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
    ]);

    setInput("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">
        Welcome, {session?.user?.name}
      </h2>

      <div className="border p-4 space-y-2 min-h-[200px]">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
