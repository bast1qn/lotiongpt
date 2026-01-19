import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/hooks/useToast";
import { Toaster } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {/* Ambient Background Effects */}
          <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            {/* Primary gradient glow - top right */}
            <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[var(--color-primary-500)] opacity-[0.03] blur-[150px] rounded-full animate-pulse-glow" />

            {/* Secondary gradient glow - bottom left */}
            <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-[var(--color-primary-600)] opacity-[0.02] blur-[120px] rounded-full animate-pulse-subtle" />

            {/* Tertiary accent glow - top left */}
            <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-blue-500 opacity-[0.015] blur-[100px] rounded-full animate-pulse-subtle" style={{ animationDelay: '1s' }} />

            {/* Subtle noise overlay */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay noise-overlay" />

            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
          </div>

          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
