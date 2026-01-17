// "use client";

// import { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import ChatSidebar from "@/components/chat-sidebar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// type Message = {
//   role: "user" | "assistant";
//   content: string;
// };

// export default function Page() {
//   const { data: session, status } = useSession();

//   const [activeChatId, setActiveChatId] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Load messages for selected chat
//   useEffect(() => {
//     if (!activeChatId) {
//       setMessages([]);
//       return;
//     }

//     fetch(`/api/chats/${activeChatId}/messages`)
//       .then((res) => res.json())
//       .then(setMessages);
//   }, [activeChatId]);

//   if (status === "loading") return <p>Loading...</p>;
//   if (!session) return <p>Unauthorized</p>;

//   const sendMessage = async () => {
//     if (!input.trim() || !activeChatId || loading) return;

//     const userMessage = {
//       role: "user" as const,
//       content: input,
//     };

//     // 1️⃣ Optimistic update (user message)
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           messages: [...messages, userMessage],
//         }),
//       });

//       const data = await res.json();

//       // 2️⃣ Append AI message (THIS WAS MISSING)
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: data.content,
//         },
//       ]);
//     } catch (err) {
//       console.error("Chat error:", err);
//     } finally {
//       // 3️⃣ ALWAYS stop loading
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="flex h-screen">
//       {/* SIDEBAR */}
//       <ChatSidebar
//         activeChatId={activeChatId}
//         onSelectChat={setActiveChatId}
//       />

//       {/* MAIN CHAT AREA */}
//       <div className="flex-1 flex flex-col p-4">
//         {/* HEADER */}
//         <div className="flex justify-between items-center border-b pb-2">
//           <h2 className="text-lg font-medium">
//             {activeChatId ? "Chat" : "Select or create a chat"}
//           </h2>
//           <Button
//             variant="outline"
//             onClick={() => signOut({ callbackUrl: "/login" })}
//           >
//             Logout
//           </Button>
//         </div>

//         {/* MESSAGES */}
//         <div className="flex-1 overflow-y-auto py-4 space-y-2">
//           {!activeChatId && (
//             <p className="text-muted-foreground">
//               Select a chat from the left or create a new one.
//             </p>
//           )}

//           {activeChatId && messages.length === 0 && (
//             <p className="text-muted-foreground">
//               Start the conversation…
//             </p>
//           )}

//           {messages.map((msg, idx) => (
//             <div key={idx}>
//               <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
//               {msg.content}
//             </div>
//           ))}
//         </div>

//         {/* INPUT */}
//         {activeChatId && (
//           <div className="flex gap-2 border-t pt-2">
//             <Input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") sendMessage();
//               }}
//             />
//             <Button onClick={sendMessage} disabled={loading}>
//               {loading ? "Thinking..." : "Send"}
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ChatSidebar from "@/components/chat-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Page() {
  const { data: session, status } = useSession();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load messages for selected chat
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    fetch(`/api/chats/${activeChatId}/messages`)
      .then((res) => res.json())
      .then(setMessages)
      .catch(console.error);
  }, [activeChatId]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Unauthorized</p>;

  const sendMessage = async () => {
    if (!input.trim() || !activeChatId || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `/api/chats/${activeChatId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
      />

      <div className="flex-1 flex flex-col p-4">
        <div className="flex justify-between border-b pb-2">
          <h2 className="text-lg">
            {activeChatId ? "Chat" : "Select a chat"}
          </h2>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {messages.map((msg, i) => (
            <div key={i}>
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>

        {activeChatId && (
          <div className="flex gap-2 border-t pt-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={loading}>
              {loading ? "Thinking..." : "Send"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
