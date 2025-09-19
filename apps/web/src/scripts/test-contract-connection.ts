/**
 * Test script to verify contract connection and EIP-712 domain
 * Run this to test your setup before going live
 * 
 * Usage: node -r ts-node/register src/scripts/test-contract-connection.ts
 */

const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x0De029d8A773425219945A21386ae11f76Bb7e08';
const CHAIN_ID = 42220; // Celo Mainnet

async function testContractConnection() {
  console.log('🧪 Testing contract connection...\n');

  try {
    // Connect to Celo
    const provider = new ethers.JsonRpcProvider('https://forno.celo.org');
    console.log('✅ Connected to Celo RPC');

    // Get contract instance
    const contractABI = [
      "function eip712Domain() view returns (bytes1 fields, string memory name, string memory version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] memory extensions)",
      "function primarySaleRecipient() view returns (address)",
      "function name() view returns (string)",
      "function symbol() view returns (string)"
    ];

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    console.log('✅ Contract instance created');

    // Test basic contract calls
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      console.log(`✅ Token: ${name} (${symbol})`);
    } catch (error) {
      console.log('⚠️  Could not fetch token name/symbol (this might be normal)');
    }

    // Get EIP-712 domain (most important)
    const domainData = await contract.eip712Domain();
    const domain = {
      name: domainData[1],
      version: domainData[2],
      chainId: Number(domainData[3]),
      verifyingContract: domainData[4]
    };

    console.log('\n📋 EIP-712 Domain Configuration:');
    console.log(`   Name: "${domain.name}"`);
    console.log(`   Version: "${domain.version}"`);
    console.log(`   Chain ID: ${domain.chainId}`);
    console.log(`   Contract: ${domain.verifyingContract}`);

    // Validate domain
    if (domain.chainId !== CHAIN_ID) {
      console.log(`❌ Chain ID mismatch! Expected ${CHAIN_ID}, got ${domain.chainId}`);
      return false;
    }

    if (domain.verifyingContract.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) {
      console.log(`❌ Contract address mismatch!`);
      console.log(`   Expected: ${CONTRACT_ADDRESS}`);
      console.log(`   Got: ${domain.verifyingContract}`);
      return false;
    }

    // Get primary sale recipient
    const primarySaleRecipient = await contract.primarySaleRecipient();
    console.log(`\n💰 Primary Sale Recipient: ${primarySaleRecipient}`);

    console.log('\n✅ All contract tests passed!');
    console.log('\n📝 Next steps:');
    console.log('1. Create apps/contracts/.env with your PRIVATE_KEY');
    console.log('2. Test the full claim flow in your app');
    console.log('3. Monitor for any errors in the browser console');

    return true;

  } catch (error: any) {
    console.error('❌ Contract connection failed:', error.message);
    
    if (error.message?.includes('timeout')) {
      console.log('\n💡 This might be a temporary network issue. Try again.');
    } else if (error.message?.includes('revert')) {
      console.log('\n💡 The contract might not support the expected functions.');
    }
    
    return false;
  }
}

// Run the test
testContractConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
