import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans, Geist_Mono, Geist } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GwenUI Supreme — Parallax Hero",
  description:
    "Full-section hero block with floating layered depth parallax powered by Framer Motion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${jakarta.variable} ${geist.variable} ${geistMono.variable} antialiased`}
    >
      <body style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--text)" }}>{children}</body>
    </html>
  );
}
