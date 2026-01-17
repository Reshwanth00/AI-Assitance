import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">
          Welcome to AI Assistant
        </h2>

        <Link href="/login">
          <Button size="lg">Go to Login</Button>
        </Link>
      </div>
    </div>
  );
}
