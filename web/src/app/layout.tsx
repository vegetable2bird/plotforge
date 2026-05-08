import type { Metadata } from "next";
import { ThemeShell } from "@/components/theme-shell";
import "./globals.css";

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
    <html lang="zh-CN" className="h-full antialiased" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <body className="h-full overflow-hidden"><ThemeShell>{children}</ThemeShell></body>
    </html>
  );
}
