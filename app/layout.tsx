/**
 * Root Layout
 * Wraps all pages in the application
 * Provides fonts, global styles, and metadata
 */

import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers/session-provider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfoliyours - Your Career Portfolio Manager",
  description: "Manage your career, projects, experiences, and job applications all in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${outfit.variable} ${jakarta.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
