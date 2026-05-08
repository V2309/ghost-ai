import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
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
  title: "Ghost AI",
  description: "Real-time collaborative system design workspace powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
        <ClerkProvider
          appearance={{
            theme: dark,
            variables: {
              colorPrimary: 'var(--accent-primary)',
              colorBackground: 'var(--bg-surface)',
              colorDanger: 'var(--state-error)',
              colorSuccess: 'var(--state-success)',
              colorWarning: 'var(--state-warning)',
            },
            elements: {
              card: 'bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-none',
            }
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
