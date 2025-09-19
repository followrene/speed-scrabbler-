# Speed Scrabbler

A fast-paced word scramble game built on Celo and Farcaster. Test your spelling skills by unscrambling letters while racing against time!

## Features

- **Progressive Difficulty**: Start with 3-letter words, progress to 9-letter words
- **30-Second Timer**: Each word gets a fresh 30-second timer
- **Smart Hints**: Auto-revealing letters with point penalties
- **Explosion Effects**: Satisfying visual feedback for word completion
- **Celo Integration**: Built on the Celo blockchain
- **Farcaster Ready**: Optimized for Farcaster Mini Apps

## Game Rules

1. **Round 1**: 3 words × 3 letters each
2. **Round 2**: 3 words × 4 letters each  
3. **Round 3**: 3 words × 5 letters each
4. **Continue**: Word length increases each round (max 9 letters)
5. **Scoring**: +10 points per word + time bonus, -10 points per auto-revealed letter
6. **Game Over**: When time runs out OR score goes below 0

## Project Structure

This is a monorepo managed by Turborepo with the following structure:

- `apps/web` - Next.js application with the Speed Scrabbler game
- `packages/hardhat` - Smart contract development environment

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
cd apps/web
pnpm dev
```

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all packages and apps
- `pnpm type-check` - Run TypeScript type checking

### Smart Contract Scripts

- `pnpm contracts:compile` - Compile smart contracts
- `pnpm contracts:test` - Run smart contract tests
- `pnpm contracts:deploy` - Deploy contracts to local network
- `pnpm contracts:deploy:alfajores` - Deploy to Celo Alfajores testnet
- `pnpm contracts:deploy:celo` - Deploy to Celo mainnet

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, ShadCN Components
- **Smart Contracts**: Hardhat with Viem
- **Blockchain**: Celo Network
- **Social**: Farcaster Integration
- **Monorepo**: Turborepo
- **Package Manager**: PNPM
- **Deployment**: Vercel-ready

## Farcaster Integration

This app is designed as a Farcaster Mini App with:
- Progressive Web App (PWA) capabilities
- Farcaster manifest endpoint
- Mobile-optimized UI
- Social sharing features

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Celo Documentation](https://docs.celo.org/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## License

MIT License - see LICENSE file for details.
