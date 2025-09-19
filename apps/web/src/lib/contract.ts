import { Address } from 'viem';

// Contract configuration
export const CONTRACT_ADDRESS: Address = '0x0De029d8A773425219945A21386ae11f76Bb7e08';
export const CHAIN_ID = 42220; // Celo Mainnet

// Contract ABI - focusing on the functions we need
export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "components": [
          {"internalType": "address", "name": "to", "type": "address"},
          {"internalType": "address", "name": "primarySaleRecipient", "type": "address"},
          {"internalType": "uint256", "name": "quantity", "type": "uint256"},
          {"internalType": "uint256", "name": "price", "type": "uint256"},
          {"internalType": "address", "name": "currency", "type": "address"},
          {"internalType": "uint128", "name": "validityStartTimestamp", "type": "uint128"},
          {"internalType": "uint128", "name": "validityEndTimestamp", "type": "uint128"},
          {"internalType": "bytes32", "name": "uid", "type": "bytes32"}
        ],
        "internalType": "struct ITokenERC20.MintRequest",
        "name": "_req",
        "type": "tuple"
      },
      {"internalType": "bytes", "name": "_signature", "type": "bytes"}
    ],
    "name": "mintWithSignature",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {"internalType": "address", "name": "to", "type": "address"},
          {"internalType": "address", "name": "primarySaleRecipient", "type": "address"},
          {"internalType": "uint256", "name": "quantity", "type": "uint256"},
          {"internalType": "uint256", "name": "price", "type": "uint256"},
          {"internalType": "address", "name": "currency", "type": "address"},
          {"internalType": "uint128", "name": "validityStartTimestamp", "type": "uint128"},
          {"internalType": "uint128", "name": "validityEndTimestamp", "type": "uint128"},
          {"internalType": "bytes32", "name": "uid", "type": "bytes32"}
        ],
        "internalType": "struct ITokenERC20.MintRequest",
        "name": "_req",
        "type": "tuple"
      },
      {"internalType": "bytes", "name": "_signature", "type": "bytes"}
    ],
    "name": "verify",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"},
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eip712Domain",
    "outputs": [
      {"internalType": "bytes1", "name": "fields", "type": "bytes1"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "version", "type": "string"},
      {"internalType": "uint256", "name": "chainId", "type": "uint256"},
      {"internalType": "address", "name": "verifyingContract", "type": "address"},
      {"internalType": "bytes32", "name": "salt", "type": "bytes32"},
      {"internalType": "uint256[]", "name": "extensions", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "primarySaleRecipient",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Types for our mint request
export interface MintRequest {
  to: string;
  primarySaleRecipient: string;
  quantity: string;
  price: string;
  currency: string;
  validityStartTimestamp: number;
  validityEndTimestamp: number;
  uid: string;
}

export interface MintSignatureResponse {
  mintRequest: MintRequest;
  signature: string;
  signerAddress: string;
}

// API function to get mint signature
export async function generateMintSignature(walletAddress: string, points: number): Promise<MintSignatureResponse> {
  try {
    const response = await fetch('/api/generate-mint-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        points,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate mint signature';
      
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (parseError) {
        // If we can't parse the error response, use status-based message
        if (response.status === 400) {
          errorMessage = 'Invalid request parameters';
        } else if (response.status === 500) {
          errorMessage = 'Server configuration error';
        } else if (response.status === 503) {
          errorMessage = 'Service temporarily unavailable';
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.mintRequest || !data.signature || !data.signerAddress) {
      throw new Error('Invalid response from server');
    }

    return data;
    
  } catch (error: any) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Re-throw other errors as-is
    throw error;
  }
}
