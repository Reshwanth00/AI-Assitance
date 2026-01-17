// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import ChatSidebar from "@/components/chat-sidebar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// type Message = {
//   role: "user" | "assistant";
//   content: string;
//   createdAt?: string;
// };

// /* =========================
//    Normalize AI responses
// ========================== */
// function normalizeAIContent(raw: any) {
//   if (!raw || typeof raw !== "object") return raw;

//   if (raw.tool === "getWeather") {
//     return {
//       type: "weather",
//       location: raw.location,
//       temperature: raw.temp,
//       condition: raw.condition,
//     };
//   }

//   if (raw.tool === "getF1Matches") {
//     return {
//       type: "f1",
//       raceName: raw.race,
//       date: raw.date,
//     };
//   }

//   if (raw.tool === "getStockPrice") {
//     return {
//       type: "stock",
//       symbol: raw.symbol,
//       price: raw.price,
//     };
//   }

//   if (raw.type === "error") {
//     return raw;
//   }

//   return raw;
// }

// export default function Page() {
//   const { data: session, status } = useSession();

//   const [activeChatId, setActiveChatId] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingOlder, setLoadingOlder] = useState(false);

//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const containerRef = useRef<HTMLDivElement>(null);

//   /* =========================
//      Load last 20 messages
//   ========================== */
//   useEffect(() => {
//     if (!activeChatId) {
//       setMessages([]);
//       setHasMore(true);
//       return;
//     }

//     fetch(`/api/chats/${activeChatId}/messages?limit=20`)
//       .then((res) => res.json())
//       .then((data) => {
//         setMessages(data.messages);
//         setHasMore(data.hasMore);

//         requestAnimationFrame(() => {
//           containerRef.current?.scrollTo({
//             top: containerRef.current.scrollHeight,
//           });
//         });
//       })
//       .catch(console.error);
//   }, [activeChatId]);

//   /* =========================
//      Auto-scroll on new msg
//   ========================== */
//   useEffect(() => {
//     if (!containerRef.current) return;

//     containerRef.current.scrollTo({
//       top: containerRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages.length]);

//   /* =========================
//      Load older messages
//   ========================== */
//   const loadOlderMessages = async () => {
//     if (!activeChatId || !hasMore || loadingOlder || messages.length === 0)
//       return;

//     setLoadingOlder(true);

//     const oldest = messages[0].createdAt;
//     if (!oldest) return;

//     const prevScrollHeight = containerRef.current?.scrollHeight ?? 0;

//     const res = await fetch(
//       `/api/chats/${activeChatId}/messages?limit=20&cursor=${oldest}`
//     );
//     const data = await res.json();

//     setMessages((prev) => [...data.messages, ...prev]);
//     setHasMore(data.hasMore);

//     requestAnimationFrame(() => {
//       if (!containerRef.current) return;
//       const newScrollHeight = containerRef.current.scrollHeight;
//       containerRef.current.scrollTop =
//         newScrollHeight - prevScrollHeight;
//     });

//     setLoadingOlder(false);
//   };

//   /* =========================
//      Send message
//   ========================== */
//   const sendMessage = async () => {
//     if (!input.trim() || !activeChatId || loading) return;

//     const userMessage: Message = {
//       role: "user",
//       content: input,
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(
//         `/api/chats/${activeChatId}/messages`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             messages: [...messages, userMessage],
//           }),
//         }
//       );

//       const data = await res.json();

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: JSON.stringify(data.content),
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (status === "loading") return <p>Loading...</p>;
//   if (!session) return <p>Unauthorized</p>;

//   return (
//     <div className="flex h-screen">
//       <ChatSidebar
//         activeChatId={activeChatId}
//         onSelectChat={setActiveChatId}
//       />

//       <div className="flex-1 flex flex-col p-4">
//         <div className="flex justify-between border-b pb-2">
//           <h2 className="text-lg">
//             {activeChatId ? "Chat" : "Select a chat"}
//           </h2>
//           <Button
//             variant="outline"
//             onClick={() => signOut({ callbackUrl: "/login" })}
//           >
//             Logout
//           </Button>
//         </div>

//         <div
//           ref={containerRef}
//           className="flex-1 overflow-y-auto py-4 space-y-3"
//           onScroll={(e) => {
//             if (e.currentTarget.scrollTop === 0) {
//               loadOlderMessages();
//             }
//           }}
//         >
//           {loadingOlder && (
//             <p className="text-center text-sm text-muted-foreground">
//               Loading older messages…
//             </p>
//           )}

//           {messages.map((msg, idx) => {
//             let content: any = msg.content;

//             try {
//               content = normalizeAIContent(JSON.parse(msg.content));
//             } catch {
//               // plain text
//             }

//             return (
//               <div key={idx}>
//                 <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}

//                 {content?.type === "weather" && (
//                   <div className="border rounded p-2 mt-1">
//                     🌤 <b>{content.location}</b><br />
//                     Temp: {content.temperature}<br />
//                     Condition: {content.condition}
//                   </div>
//                 )}

//                 {content?.type === "f1" && (
//                   <div className="border rounded p-2 mt-1">
//                     🏎 <b>{content.raceName}</b><br />
//                     {content.date}
//                   </div>
//                 )}

//                 {content?.type === "stock" && (
//                   <div className="border rounded p-2 mt-1">
//                     📈 <b>{content.symbol}</b><br />
//                     Price: {content.price}
//                   </div>
//                 )}

//                 {content?.type === "error" && (
//                   <span className="text-red-500">
//                     ⚠ {content.message}
//                   </span>
//                 )}

//                 {typeof content === "string" && <span>{content}</span>}
//                 {content?.text && <span>{content.text}</span>}
//               </div>
//             );
//           })}
//         </div>

//         {activeChatId && (
//           <div className="flex gap-2 border-t pt-2">
//             <Input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ChatSidebar from "@/components/chat-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";

type Message = {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

/* =========================
   Normalize AI responses
========================== */
function normalizeAIContent(raw: any) {
  if (!raw || typeof raw !== "object") return raw;

  if (raw.tool === "getWeather") {
    return {
      type: "weather",
      location: raw.location,
      temperature: raw.temp,
      condition: raw.condition,
    };
  }

  if (raw.tool === "getF1Matches") {
    return {
      type: "f1",
      raceName: raw.race,
      date: raw.date,
    };
  }

  if (raw.tool === "getStockPrice") {
    return {
      type: "stock",
      symbol: raw.symbol,
      price: raw.price,
    };
  }

  return raw;
}

export default function Page() {
  const { data: session, status } = useSession();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  /* =========================
     Load last 20 messages
  ========================== */
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      setHasMore(true);
      return;
    }

    fetch(`/api/chats/${activeChatId}/messages?limit=20`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
        setHasMore(data.hasMore);

        requestAnimationFrame(() => {
          containerRef.current?.scrollTo({
            top: containerRef.current.scrollHeight,
          });
        });
      })
      .catch(console.error);
  }, [activeChatId]);

  /* =========================
     Auto-scroll
  ========================== */
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  /* =========================
     Load older messages
  ========================== */
  const loadOlderMessages = async () => {
    if (!activeChatId || !hasMore || loadingOlder || messages.length === 0)
      return;

    setLoadingOlder(true);

    const oldest = messages[0].createdAt;
    if (!oldest) return;

    const prevHeight = containerRef.current?.scrollHeight ?? 0;

    const res = await fetch(
      `/api/chats/${activeChatId}/messages?limit=20&cursor=${oldest}`
    );
    const data = await res.json();

    setMessages((prev) => [...data.messages, ...prev]);
    setHasMore(data.hasMore);

    requestAnimationFrame(() => {
      const newHeight = containerRef.current?.scrollHeight ?? 0;
      containerRef.current!.scrollTop = newHeight - prevHeight;
    });

    setLoadingOlder(false);
  };

  /* =========================
     Send message
  ========================== */
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
        {
          role: "assistant",
          content: JSON.stringify(data.content),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Unauthorized</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
      />

      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-3 border-b bg-white">
          <h2 className="font-medium">
            {activeChatId ? "Conversation" : "Select a chat"}
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </Button>
        </div>

        {/* MESSAGES */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
          onScroll={(e) => {
            if (e.currentTarget.scrollTop === 0) {
              loadOlderMessages();
            }
          }}
        >
          {loadingOlder && (
            <p className="text-center text-sm text-gray-400">
              Loading older messages…
            </p>
          )}

          {messages.map((msg, idx) => {
            // ⛔ UI FILTER: hide meta AI responses
            if (
              msg.role === "assistant" &&
              typeof msg.content === "string" &&
              (
                msg.content.includes("No specific tool is needed") ||
                msg.content.includes("tool is needed") ||
                msg.content.includes("I will use") ||
                msg.content.includes("JSON")
              )
            ) {
              return null; // 👈 UI only, data unchanged
            }

            let content: any = msg.content;

            try {
              content = normalizeAIContent(JSON.parse(msg.content));
            } catch {
              // normal text
            }

            return (
              <div
                key={idx}
                className={clsx(
                  "rounded-lg px-4 py-3 text-sm w-fit max-w-[70%]",
                  msg.role === "user"
                    ? "ml-auto bg-gray-200 text-gray-900"
                    : "mr-auto bg-white border"
                )}

              >
                {/* WEATHER */}
                {content?.type === "weather" && (
                  <div>
                    🌤 <b>{content.location}</b><br />
                    {content.temperature} · {content.condition}
                  </div>
                )}

                {/* F1 */}
                {content?.type === "f1" && (
                  <div>
                    🏎 <b>{content.raceName}</b><br />
                    {content.date}
                  </div>
                )}

                {/* STOCK */}
                {content?.type === "stock" && (
                  <div>
                    📈 <b>{content.symbol}</b><br />
                    {content.price}
                  </div>
                )}

                {/* TEXT */}
                {typeof content === "string" && <span>{content}</span>}
                {content?.text && <span>{content.text}</span>}
              </div>
            );
          })}

        </div>

        {/* INPUT */}
        {activeChatId && (
          <div className="border-t bg-white px-6 py-3 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={loading}>
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
