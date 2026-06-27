import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bhavora — Urban Intelligence Operating System",
  description: "Government-grade urban intelligence platform. Real-time city simulation, AI-driven decisions, and multi-agent operations for smart city programs and infrastructure authorities.",
  keywords: ["urban intelligence", "smart city", "digital twin", "city simulation", "government technology", "Bengaluru", "BBMP", "infrastructure planning"],
  authors: [{ name: "Bhavora Technologies" }],
  openGraph: {
    title: "Bhavora Urban Intelligence OS",
    description: "Real-time city simulation. AI-driven decisions. Built for the cities of tomorrow.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#050A14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-text-primary" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
