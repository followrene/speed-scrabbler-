# Speed Scrabbler Token Claiming Setup

## Overview
This implementation adds token claiming functionality to the Speed Scrabbler typing test app. Users can earn "Speed Scrabble Stars" tokens based on their game performance, with a 1:1 ratio of points to tokens.

## 🔐 CRITICAL SECURITY SETUP

### 1. Private Key Configuration
**⚠️ EXTREMELY IMPORTANT: You MUST set up the private key before the token claiming will work.**

1. Create the file `apps/contracts/.env` (this file is gitignored for security)
2. Add your private key:
```bash
# Private key for signing mint requests
# NEVER commit this file to version control
PRIVATE_KEY=0x1234567890abcdef...your_actual_private_key_here
```

3. **Security Requirements:**
   - The private key MUST correspond to an authorized signer for the contract
   - NEVER commit the `.env` file to version control
   - NEVER share the private key
   - Use a dedicated wallet for signing (not your main wallet)

### 2. Verify Contract Configuration
The app is configured for:
- **Contract Address**: `0x0De029d8A773425219945A21386ae11f76Bb7e08`
- **Network**: Celo Mainnet (Chain ID: 42220)
- **RPC**: Uses Forno (Celo's public RPC)

## 🏗️ Architecture

### Backend API (`/api/generate-mint-signature`)
- Validates user inputs (wallet address, points 1-1000)
- Reads private key from `apps/contracts/.env`
- Fetches EIP-712 domain from contract using `eip712Domain()`
- Generates unique UID to prevent replay attacks
- Signs structured data using EIP-712
- Returns mint request + signature (1-minute expiration)

### Frontend Integration
- Integrated into game over screen
- Shows claim button when score > 0
- Handles all transaction states (generating, signing, pending, success, error)
- Provides Celoscan transaction links
- Comprehensive error handling with retry options

### Smart Contract Integration
- Uses `mintWithSignature()` function
- Free mints (price = 0, user pays only gas)
- 18-decimal token precision
- Proper type conversion (string → BigInt)

## 🎮 User Experience Flow

1. **Complete Game**: User finishes typing test and sees final score
2. **Claim Prompt**: "Claim Your Reward" section appears if score > 0
3. **Connect Wallet**: User must connect wallet to claim
4. **Claim Process**:
   - Click "Claim X Tokens" button
   - Backend generates signature (loading state)
   - Wallet prompts for transaction approval
   - "Processing transaction..." state while pending
   - Success: Confetti + Celoscan link
   - Error: Clear error message + retry option

## 🛠️ Technical Implementation

### EIP-712 Signing
```typescript
// Domain fetched from contract.eip712Domain()
const domain = {
  name: "Speed Scrabble Stars", // From contract
  version: "1",                  // From contract  
  chainId: 42220,               // Celo Mainnet
  verifyingContract: "0x0De..." // Contract address
};

// MintRequest structure
const types = {
  MintRequest: [
    { name: 'to', type: 'address' },
    { name: 'primarySaleRecipient', type: 'address' },
    { name: 'quantity', type: 'uint256' },
    { name: 'price', type: 'uint256' },
    { name: 'currency', type: 'address' },
    { name: 'validityStartTimestamp', type: 'uint128' },
    { name: 'validityEndTimestamp', type: 'uint128' },
    { name: 'uid', type: 'bytes32' }
  ]
};
```

### Contract Call Format
```typescript
// Convert to proper types for wagmi
const mintRequest = {
  to: address as `0x${string}`,
  primarySaleRecipient: recipient as `0x${string}`,
  quantity: BigInt(points * 1e18), // 18 decimals
  price: 0n,                       // Free mint
  currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as `0x${string}`,
  validityStartTimestamp: BigInt(now),
  validityEndTimestamp: BigInt(now + 60), // 1 minute
  uid: uniqueId as `0x${string}`
};
```

## 🧪 Testing Checklist

### Before Going Live:
1. **✅ Private Key Setup**: Verify `.env` file exists and contains valid key
2. **✅ Domain Verification**: Call `contract.eip712Domain()` to verify exact domain
3. **✅ Signature Testing**: Test signatures using contract's `verify()` function
4. **✅ Signer Address**: Confirm signer address matches expected authorized address
5. **✅ Contract Call**: Test full mint flow on testnet first
6. **✅ Error Handling**: Test all error scenarios (invalid signature, expired, etc.)

### Test Scenarios:
- Valid claim (1-1000 points)
- Invalid points (0, negative, >1000)
- Invalid wallet address
- Signature expiration (wait >1 minute)
- Network errors
- Transaction rejection
- Already claimed (if applicable)

## 🚨 Common Issues & Solutions

### "Invalid signature" Error
- Check EIP-712 domain matches contract exactly
- Verify signer address is authorized
- Ensure proper type conversions (string → BigInt)

### "Transaction failed" Error  
- Check contract call format (object vs array)
- Verify all BigInt conversions
- Confirm chain ID is correct (42220)

### "Server configuration error"
- Private key not found in `apps/contracts/.env`
- Invalid private key format
- File permissions issue

### "Session expired"
- Signature expired (>1 minute old)
- User needs to retry claim process

## 🔧 Environment Variables

### Required Files:
```
apps/contracts/.env
```

### Content:
```bash
# Replace with your actual private key
PRIVATE_KEY=0x1234567890abcdef...
```

## 📝 Security Notes

1. **Private Key Security**:
   - Use a dedicated signing wallet
   - Never commit `.env` files
   - Rotate keys periodically
   - Monitor for unauthorized usage

2. **Signature Validation**:
   - 1-minute expiration prevents replay attacks
   - Unique UIDs prevent duplicate claims
   - Backend validates all inputs

3. **Rate Limiting**:
   - Consider adding rate limiting to API endpoint
   - Monitor for abuse patterns
   - Set reasonable point limits (1-1000)

## 🎯 Next Steps

1. **Set up private key** in `apps/contracts/.env`
2. **Test on testnet** first (update chain ID to Alfajores)
3. **Verify contract domain** matches implementation
4. **Test all user flows** including error cases
5. **Deploy to production** with monitoring

## 📞 Support

If you encounter issues:
1. Check browser console for detailed errors
2. Verify private key setup
3. Test contract domain configuration
4. Check network connectivity to Celo RPC

The implementation includes comprehensive error handling and user feedback to guide users through any issues.
