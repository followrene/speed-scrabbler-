import { NextRequest, NextResponse } from 'next/server';

interface MintRequest {
  to: string;
  primarySaleRecipient: string;
  quantity: string;
  price: string;
  currency: string;
  validityStartTimestamp: number;
  validityEndTimestamp: number;
  uid: string;
}

interface RequestBody {
  walletAddress: string;
  points: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { walletAddress, points } = body;

    // Validation
    if (!walletAddress || typeof points !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request: walletAddress and points are required' },
        { status: 400 }
      );
    }

    // Validate points range (1-1000 tokens max)
    if (points < 1 || points > 1000) {
      return NextResponse.json(
        { error: 'Invalid token amount, please try again' },
        { status: 400 }
      );
    }

    // Dynamic imports to avoid SSR issues
    const { ethers } = await import('ethers');
    const fs = await import('fs');
    const path = await import('path');

    // Validate wallet address
    let validatedAddress: string;
    try {
      validatedAddress = ethers.getAddress(walletAddress);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Read private key from contracts/.env
    const envPath = path.join(process.cwd(), '../../apps/contracts/.env');
    let privateKey: string;
    
    try {
      if (!fs.existsSync(envPath)) {
        console.error('Environment file not found at:', envPath);
        console.error('Please create apps/contracts/.env with your PRIVATE_KEY');
        return NextResponse.json(
          { error: 'Server configuration error: Environment file not found' },
          { status: 500 }
        );
      }

      const envContent = fs.readFileSync(envPath, 'utf8');
      const privateKeyMatch = envContent.match(/PRIVATE_KEY=(.+)/);
      
      if (!privateKeyMatch) {
        console.error('PRIVATE_KEY not found in .env file');
        return NextResponse.json(
          { error: 'Server configuration error: Private key not found' },
          { status: 500 }
        );
      }

      privateKey = privateKeyMatch[1].trim();
      
      if (!privateKey || privateKey === 'your_private_key_here_replace_with_actual_key') {
        console.error('Private key not properly configured in apps/contracts/.env');
        return NextResponse.json(
          { error: 'Server configuration error: Please configure your private key' },
          { status: 500 }
        );
      }

      // Validate private key format
      if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
        console.error('Invalid private key format');
        return NextResponse.json(
          { error: 'Server configuration error: Invalid private key format' },
          { status: 500 }
        );
      }
      
    } catch (error) {
      console.error('Failed to read private key:', error);
      return NextResponse.json(
        { error: 'Server configuration error: Failed to read environment file' },
        { status: 500 }
      );
    }

    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);
    const signerAddress = wallet.address;
    
    console.log('Signer address:', signerAddress);

    // Contract configuration
    const CONTRACT_ADDRESS = '0x0De029d8A773425219945A21386ae11f76Bb7e08';
    const CHAIN_ID = 42220; // Celo Mainnet
    
    // Get contract instance to fetch domain and primarySaleRecipient
    const provider = new ethers.JsonRpcProvider('https://forno.celo.org');
    const contractABI = [
      "function eip712Domain() view returns (bytes1 fields, string memory name, string memory version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] memory extensions)",
      "function primarySaleRecipient() view returns (address)"
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    
    // Get EIP-712 domain from contract
    let domain;
    let primarySaleRecipient: string;
    
    try {
      // Add timeout for contract calls
      const domainPromise = contract.eip712Domain();
      const recipientPromise = contract.primarySaleRecipient();
      
      const [domainData, recipientData] = await Promise.race([
        Promise.all([domainPromise, recipientPromise]),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Contract call timeout')), 10000)
        )
      ]) as any[];
      
      primarySaleRecipient = recipientData;
      
      domain = {
        name: domainData[1], // name
        version: domainData[2], // version
        chainId: Number(domainData[3]), // chainId
        verifyingContract: domainData[4] // verifyingContract
      };
      
      // Validate domain data
      if (!domain.name || !domain.version || !domain.chainId || !domain.verifyingContract) {
        throw new Error('Invalid domain data received from contract');
      }
      
      if (domain.chainId !== CHAIN_ID) {
        console.error(`Chain ID mismatch: expected ${CHAIN_ID}, got ${domain.chainId}`);
        throw new Error('Chain ID mismatch');
      }
      
      console.log('Contract domain:', domain);
      console.log('Primary sale recipient:', primarySaleRecipient);
      
    } catch (error: any) {
      console.error('Failed to get contract domain:', error);
      
      if (error.message?.includes('timeout')) {
        return NextResponse.json(
          { error: 'Contract connection timeout. Please try again.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to connect to contract. Please try again.' },
        { status: 500 }
      );
    }

    // Generate unique UID and timestamps
    const now = Math.floor(Date.now() / 1000);
    const uid = ethers.keccak256(
      ethers.toUtf8Bytes(`${validatedAddress}-${points}-${now}-${Math.random()}`)
    );

    // Create mint request
    const mintRequest: MintRequest = {
      to: validatedAddress,
      primarySaleRecipient: primarySaleRecipient,
      quantity: ethers.parseUnits(points.toString(), 18).toString(), // Convert to 18 decimals
      price: "0", // Free mint
      currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Native currency placeholder
      validityStartTimestamp: now,
      validityEndTimestamp: now + 60, // 1 minute expiration
      uid: uid
    };

    // EIP-712 types for MintRequest
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

    // Sign the structured data
    const signature = await wallet.signTypedData(domain, types, mintRequest);
    
    console.log('Generated signature for:', validatedAddress, 'Points:', points);

    return NextResponse.json({
      mintRequest,
      signature,
      signerAddress
    });

  } catch (error) {
    console.error('Error generating mint signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
