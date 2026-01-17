import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 h-screen">
        <Providers>
          <div className="h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
