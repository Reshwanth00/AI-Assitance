"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Chat = {
  id: string;
  title: string;
};

export default function ChatSidebar({
  activeChatId,
  onSelectChat,
}: {
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}) {
  const [chats, setChats] = useState<Chat[]>([]);

  // Load chats
  useEffect(() => {
    fetch("/api/chats")
      .then((res) => res.json())
      .then(setChats);
  }, []);

  // Create new chat
  const handleNewChat = async () => {
    const res = await fetch("/api/chats", { method: "POST" });
    const chat = await res.json();
    setChats((prev) => [chat, ...prev]);
    onSelectChat(chat.id);
  };

  return (
    <div className="w-64 border-r p-4 space-y-2">
      <Button className="w-full" onClick={handleNewChat}>
        + New Chat
      </Button>

      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`p-2 rounded cursor-pointer ${
            chat.id === activeChatId
              ? "bg-muted"
              : "hover:bg-muted/50"
          }`}
          onClick={() => onSelectChat(chat.id)}
        >
          {chat.title}
        </div>
      ))}
    </div>
  );
}
