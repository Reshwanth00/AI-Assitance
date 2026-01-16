import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Assistant",
  description: "AI-powered assistant with tool calling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b p-4">
          <h1 className="text-lg font-medium">AI Assistant</h1>
        </header>

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
