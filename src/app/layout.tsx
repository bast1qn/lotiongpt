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
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-accent-500)] focus:text-white focus:rounded-lg focus:font-medium focus:shadow-lg"
        >
          Zum Hauptinhalt springen
        </a>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
