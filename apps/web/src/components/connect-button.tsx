"use client"

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useMiniApp } from '@/contexts/miniapp-context'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function WalletConnectButton({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingConnector, setConnectingConnector] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { context } = useMiniApp()

  useEffect(() => {
    if (isConnected && address) {
      console.log('Wallet connected:', { address, chain: chain?.name, chainId: chain?.id })
      setIsSheetOpen(false) // Close the sheet when connected
    }
  }, [isConnected, address, chain])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnectWithConnector = async (connector: any) => {
    setIsConnecting(true)
    setConnectingConnector(connector.id)
    
    try {
      console.log('Attempting to connect with connector:', connector.id)
      await connect({ connector })
      console.log('Wallet connection successful!')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
      setConnectingConnector(null)
    }
  }

  const getConnectorIcon = (connectorId: string) => {
    if (connectorId.includes('farcaster') || connectorId.includes('frame')) {
      return '🎭'
    } else if (connectorId === 'injected') {
      return '🦊' // MetaMask/Injected wallets
    } else if (connectorId.includes('walletConnect')) {
      return '🔗'
    }
    return '💳'
  }

  const getConnectorName = (connector: any) => {
    if (connector.id.includes('farcaster') || connector.id.includes('frame')) {
      return 'Farcaster Wallet'
    } else if (connector.id === 'injected') {
      return 'Browser Wallet (MetaMask, Valora, etc.)'
    } else if (connector.id.includes('walletConnect')) {
      return 'WalletConnect'
    }
    return connector.name || connector.id
  }

  // Check if we're in Farcaster context
  const inFarcaster = context && typeof window !== 'undefined' && window.parent !== window
  
  const handleQuickConnect = async () => {
    console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })))
    
    // If in Farcaster, try to connect with Farcaster connector first
    if (inFarcaster) {
      const frameConnector = connectors.find(connector => 
        connector.id.includes('farcaster') || connector.id.includes('frame')
      )
      if (frameConnector) {
        await handleConnectWithConnector(frameConnector)
        return
      }
    }
    
    // If not in Farcaster or no Farcaster connector, show wallet selection
    setIsSheetOpen(true)
  }

  if (!mounted) {
    return (
      <button 
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${className}`}
        disabled
      >
        Connect Wallet
      </button>
    )
  }

  if (!isConnected) {
    // If in Farcaster, try direct connection first
    if (inFarcaster && !isSheetOpen) {
      return (
        <button
          onClick={handleQuickConnect}
          type="button"
          disabled={isConnecting}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${className}`}
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Connecting...
            </>
          ) : (
            'Connect Wallet'
          )}
        </button>
      )
    }

    // Show wallet selection dialog for regular browsers
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <button
            onClick={() => setIsSheetOpen(true)}
            type="button"
            disabled={isConnecting}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${className}`}
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Connecting...
              </>
            ) : (
              'Connect Wallet'
            )}
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[400px]">
          <SheetHeader>
            <SheetTitle>Connect Your Wallet</SheetTitle>
            <SheetDescription>
              Choose a wallet to connect to Speed Scrabbler and claim your tokens on Celo.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-3 mt-6">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                variant="outline"
                className="flex items-center justify-start gap-3 h-12 p-4"
                onClick={() => handleConnectWithConnector(connector)}
                disabled={isConnecting}
              >
                <span className="text-2xl">{getConnectorIcon(connector.id)}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{getConnectorName(connector)}</div>
                  {connector.id === 'injected' && (
                    <div className="text-xs text-muted-foreground">
                      Works with MetaMask, Valora, and other browser wallets
                    </div>
                  )}
                </div>
                {connectingConnector === connector.id && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                )}
              </Button>
            ))}
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>New to crypto wallets?</strong> We recommend <a href="https://valora.xyz" target="_blank" rel="noopener noreferrer" className="text-primary underline">Valora</a> for the best Celo experience.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        {chain?.name || 'Celo'}
      </div>

      <button
        onClick={() => disconnect()}
        type="button"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        title={`Connected: ${address} on ${chain?.name || 'Unknown network'}`}
      >
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
      </button>
    </div>
  )
}
