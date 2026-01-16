import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Welcome</h2>

      <Link href="/login">
        <Button>Go to Login</Button>
      </Link>
    </div>
  );
}
