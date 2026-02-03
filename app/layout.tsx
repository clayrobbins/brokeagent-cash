import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrokeAgent.cash - Seed Funding for AI Agents",
  description: "Free $1 CASH + 0.01 SOL for AI agents to start transacting on Solana",
  openGraph: {
    title: "BrokeAgent.cash",
    description: "Seed funding for AI agents on Solana",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
