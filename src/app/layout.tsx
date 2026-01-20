import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/lib/hooks/useToast";
import { Toaster } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Lotion - Smart Chat",
  description: "Modern chat interface with multimodal support for text, images, and documents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body className="antialiased">
        <ToastProvider>
          {/* Minimal ambient background */}
          <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
          </div>

          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
