"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not logged in</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">
        Welcome, {session.user?.name}
      </h2>

      <p>Email: {session.user?.email}</p>

      <Button onClick={() => signOut({ callbackUrl: "/login" })}>
        Logout
      </Button>
    </div>
  );
}
