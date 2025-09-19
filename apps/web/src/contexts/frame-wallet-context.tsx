"use client";

import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// WalletConnect project ID (you should get this from walletconnect.com)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

const config = createConfig({
  chains: [celo, celoAlfajores],
  connectors: [
    farcasterMiniApp(),
    injected(), // For MetaMask, Valora, etc.
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Speed Scrabbler',
        description: 'A word scramble game on Celo',
        url: 'https://speed-scrabbler.vercel.app',
        icons: ['https://speed-scrabbler.vercel.app/icon.png']
      }
    }),
  ],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function FrameWalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
