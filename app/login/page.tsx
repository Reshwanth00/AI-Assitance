// "use client";

// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";

// export default function LoginPage() {
//   return (
//     <div className="space-y-4">
//       <Button onClick={() => signIn("google", { callbackUrl: "/chat" })}>
//         Sign in with Google
//       </Button>

//       <Button onClick={() => signIn("github", { callbackUrl: "/chat" })}>
//         Sign in with GitHub
//       </Button>
//     </div>
//   );
// }



"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">
            Sign in to AI Assistant
          </h1>
          <p className="text-sm text-gray-500">
            Choose a provider to continue
          </p>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/chat" })}
          >
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("github", { callbackUrl: "/chat" })}
          >
            Continue with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
