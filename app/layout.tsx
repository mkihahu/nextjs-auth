import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Access Control",
  description:
    "Role-based access control system for teams built with Next.js and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="min-h-screen bg-slate-950 text-slate">{children}</body>
    </html>
  );
}
