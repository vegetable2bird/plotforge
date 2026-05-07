import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeShell } from "@/components/theme-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "小说 AI 辅助创作平台",
  description: "为长篇小说创作者打造的高质感 AI 创作工作台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden"><ThemeShell>{children}</ThemeShell></body>
    </html>
  );
}
