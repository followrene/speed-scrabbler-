# Speed Scrabbler - Hardhat Package

Smart contract development environment for the Speed Scrabbler game on Celo.

## Overview

This package contains the smart contract infrastructure for the Speed Scrabbler game, including:

- **Game Contracts**: Core game logic and scoring mechanisms
- **Token Integration**: CELO, USDT, and WETH token support
- **Deployment Scripts**: Automated contract deployment to Celo networks
- **Testing Suite**: Comprehensive contract testing

## Development

```bash
# Install dependencies
pnpm install

# Compile contracts
pnpm compile

# Run tests
pnpm test

# Deploy to local network
pnpm deploy:local

# Deploy to Alfajores testnet
pnpm deploy:alfajores

# Deploy to Celo mainnet
pnpm deploy:celo
```

## Network Configuration

- **Local**: Hardhat local network for development
- **Alfajores**: Celo testnet for testing
- **Celo**: Celo mainnet for production

## License

MIT License - see LICENSE file for details. 