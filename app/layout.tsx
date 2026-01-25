import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://mumints.vercel.app"),
  title: "Us | Shared Space",
  description: "A private corner for us to share moments and memories.",
  openGraph: {
    title: "Us | Shared Space",
    description: "A private corner for us to share moments and memories.",
    url: "https://mumints.vercel.app", // Fallback URL, override with your actual domain if different
    siteName: "Us",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Us Shared Space Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Us | Shared Space",
    description: "A private corner for us to share moments and memories.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased selection:bg-rose-100 selection:text-rose-900 dark:selection:bg-yellow-500/30`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
