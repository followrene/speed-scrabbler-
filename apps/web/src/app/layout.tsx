import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Navbar } from '@/components/navbar';
import Providers from "@/components/providers"

const inter = Inter({ subsets: ['latin'] });

const appUrl = process.env.NEXT_PUBLIC_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

// Mini App metadata for Farcaster sharing (NOT Frame metadata)
const miniApp = {
  version: "1", // Must be "1", not "next"
  imageUrl: `${appUrl}/opengraph-image.png`, // 3:2 aspect ratio
  button: {
    title: "Play Speed Scrabbler", // Max 32 characters
    action: {
      type: "launch_frame",
      name: "Speed Scrabbler",
      url: appUrl,
      splashImageUrl: `${appUrl}/icon.png`, // 200x200px
      splashBackgroundColor: "#ffffff",
    },
  },
};

export const metadata: Metadata = {
  title: 'Speed Scrabbler',
  description: 'A new game for Celo people on Farcaster',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  openGraph: {
    title: 'Speed Scrabbler',
    description: 'A new game for Celo people on Farcaster',
    images: [`${appUrl}/opengraph-image.png`],
  },
  other: {
    // Farcaster Mini App metadata (NOT Frame metadata)
    "fc:miniapp": JSON.stringify(miniApp),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar is included on all pages */}
        <div className="relative flex min-h-screen flex-col">
          <Providers>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
