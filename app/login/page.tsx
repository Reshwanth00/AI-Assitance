"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <Button onClick={() => signIn("google", { callbackUrl: "/chat" })}>
        Sign in with Google
      </Button>

      <Button onClick={() => signIn("github", { callbackUrl: "/chat" })}>
        Sign in with GitHub
      </Button>
    </div>
  );
}
