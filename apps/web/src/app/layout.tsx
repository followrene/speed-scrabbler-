import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Navbar } from '@/components/navbar';
import Providers from "@/components/providers"

const inter = Inter({ subsets: ['latin'] });

const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// Embed metadata for Farcaster sharing
const frame = {
  version: "1",
  imageUrl: `${appUrl}/opengraph-image.png`,
  button: {
    title: "Launch Speed Scrabbler",
    action: {
      type: "launch_frame",
      name: "Speed Scrabbler",
      url: appUrl,
      splashImageUrl: `${appUrl}/icon.png`,
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
    // Farcaster frame metadata
    "fc:frame": "vNext",
    "fc:frame:image": `${appUrl}/opengraph-image.png`,
    "fc:frame:button:1": "Play Speed Scrabbler",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": appUrl,
    
    // Original frame metadata for compatibility
    "fc:frame:json": JSON.stringify(frame),
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
