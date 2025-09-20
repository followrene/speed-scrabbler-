'use client';

import { useState, useEffect, useRef } from 'react';
import { getRandomWord, scrambleWord } from '@/utils/wordList';
import { useMobileKeyboard } from '@/hooks/use-mobile-keyboard';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { generateMintSignature, CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN_ID } from '@/lib/contract';
// Removed parseUnits import as it's not used
import { WalletConnectButton } from '@/components/connect-button';

// Farcaster Mini App SDK
import { sdk } from '@farcaster/miniapp-sdk';

interface GameState {
  currentWord: string;
  scrambledWord: string;
  userInput: string;
  timeLeft: number;
  score: number;
  gameStatus: 'playing' | 'paused' | 'gameOver';
  revealedLetters: number;
}

interface ClaimState {
  status: 'idle' | 'generating' | 'signing' | 'pending' | 'success' | 'error';
  error?: string;
  txHash?: string;
}

export default function WordSpellingGame() {
  const { showKeyboard, hideKeyboard } = useMobileKeyboard();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { writeContract, data: writeData, error: writeError } = useWriteContract();
  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: writeData,
  });
  
  const [gameState, setGameState] = useState<GameState>({
    currentWord: '',
    scrambledWord: '',
    userInput: '',
    timeLeft: 45,
    score: 0,
    gameStatus: 'playing',
    revealedLetters: 0,
  });

  const [claimState, setClaimState] = useState<ClaimState>({
    status: 'idle'
  });

  // Track transaction status
  useEffect(() => {
    if (isTxPending && claimState.status === 'signing') {
      setClaimState(prev => ({ ...prev, status: 'pending', txHash: writeData }));
    }
  }, [isTxPending, writeData, claimState.status]);

  useEffect(() => {
    if (isTxSuccess && claimState.status === 'pending') {
      setClaimState(prev => ({ ...prev, status: 'success' }));
      // Trigger confetti animation here if you want to add it
    }
  }, [isTxSuccess, claimState.status]);

  useEffect(() => {
    if (writeError && claimState.status === 'signing') {
      setClaimState({
        status: 'error',
        error: writeError.message || 'Transaction failed'
      });
    }
  }, [writeError, claimState.status]);

  const handleClaimReward = async () => {
    if (!isConnected || !address || gameState.score <= 0) {
      setClaimState({
        status: 'error',
        error: 'Please connect your wallet and earn some points first'
      });
      return;
    }

    try {
      setClaimState({ status: 'generating' });

      // Generate signature from backend
      const signatureData = await generateMintSignature(address, gameState.score);
      
      setClaimState({ status: 'signing' });

      // Convert string values to proper types for contract call
      const mintRequestForContract = {
        to: signatureData.mintRequest.to as `0x${string}`,
        primarySaleRecipient: signatureData.mintRequest.primarySaleRecipient as `0x${string}`,
        quantity: BigInt(signatureData.mintRequest.quantity),
        price: BigInt(signatureData.mintRequest.price),
        currency: signatureData.mintRequest.currency as `0x${string}`,
        validityStartTimestamp: BigInt(signatureData.mintRequest.validityStartTimestamp),
        validityEndTimestamp: BigInt(signatureData.mintRequest.validityEndTimestamp),
        uid: signatureData.mintRequest.uid as `0x${string}`,
      };

      // Call contract
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintWithSignature',
        args: [mintRequestForContract, signatureData.signature as `0x${string}`],
        chainId: CHAIN_ID,
      });

    } catch (error: any) {
      console.error('Claim error:', error);
      
      let errorMessage = 'Failed to claim reward';
      
      // Categorize errors for better user experience
      if (error.message?.includes('User rejected') || error.message?.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message?.includes('expired') || error.message?.includes('Session expired')) {
        errorMessage = 'Session expired, please claim again';
      } else if (error.message?.includes('configuration')) {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setClaimState({
        status: 'error',
        error: errorMessage
      });
    }
  };

  const resetClaimState = () => {
    setClaimState({ status: 'idle' });
  };

  // Initialize game with a random word
  useEffect(() => {
    const newWord = getRandomWord();
    setGameState(prev => ({
      ...prev,
      currentWord: newWord,
      scrambledWord: scrambleWord(newWord),
      userInput: '',
      timeLeft: 45,
      score: 0,
      gameStatus: 'playing',
      revealedLetters: 0,
    }));

    // Notify Farcaster Mini App that the app is ready
    sdk.actions.ready().catch((error: any) => {
      console.log('Failed to notify Farcaster SDK ready:', error);
    });
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          return { ...prev, gameStatus: 'gameOver' as const };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus]);

  // Auto-reveal letters every 10 seconds
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const revealTimer = setInterval(() => {
      setGameState(prev => {
        if (prev.revealedLetters < prev.currentWord.length) {
          return {
            ...prev,
            revealedLetters: prev.revealedLetters + 1,
            score: Math.max(0, prev.score - 5), // Deduct 5 points for auto-reveal
          };
        }
        return prev;
      });
    }, 10000);

    return () => clearInterval(revealTimer);
  }, [gameState.gameStatus]);

  // checkWord function removed - auto-check is now handled inline in the input onChange

  const startNewGame = () => {
    const newWord = getRandomWord();
    setGameState({
      currentWord: newWord,
      scrambledWord: scrambleWord(newWord),
      userInput: '',
      timeLeft: 45,
      score: 0,
      gameStatus: 'playing',
      revealedLetters: 0,
    });
    setClaimState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Speed Scrabbler</h1>
          <p className="text-gray-600">Unscramble the letters to form a word!</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-lg p-3 text-center shadow-md">
            <div className="text-base font-bold text-blue-600">{gameState.score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-md">
            <div className="text-base font-bold text-red-600">{gameState.timeLeft}</div>
            <div className="text-sm text-gray-600">Time Left</div>
          </div>
        </div>

        {/* Scrambled Word Display */}
        <div className="bg-white rounded-lg p-3 mb-3 shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-center">Scrambled Word</h3>
          <div className="flex justify-center gap-2">
            {gameState.scrambledWord.split('').map((letter, index) => (
              <div
                key={index}
                className="w-8 h-8 border-2 border-blue-300 rounded-lg flex items-center justify-center text-base font-bold bg-blue-50 text-blue-800"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg p-3 mb-3 shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-center">Your Answer</h3>
          
          <div className="mb-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={gameState.userInput}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                  setGameState(prev => ({
                    ...prev,
                    userInput: value,
                  }));
                  
                  // Auto-check if the word is complete and correct
                  if (value.length === gameState.currentWord.length) {
                    setTimeout(() => {
                      if (value === gameState.currentWord.toUpperCase()) {
                        // Correct word! Calculate points: seconds left × word length
                        const pointsEarned = gameState.timeLeft * gameState.currentWord.length;

                        setGameState(prev => ({
                          ...prev,
                          score: prev.score + pointsEarned,
                          userInput: '',
                          revealedLetters: 0,
                        }));

                        // Get next word and reset timer
                        const newWord = getRandomWord();
                        setGameState(prev => ({
                          ...prev,
                          currentWord: newWord,
                          scrambledWord: scrambleWord(newWord),
                          timeLeft: 45, // Reset timer for next word
                        }));
                      }
                    }, 100); // Small delay to ensure state is updated
                  }
                }}
                onFocus={() => {
                  if (inputRef.current) {
                    showKeyboard(inputRef.current);
                  }
                }}
                onBlur={() => {
                  hideKeyboard();
                }}
                placeholder="Type your answer..."
                className="w-full p-3 text-center text-lg font-mono border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck="false"
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            Type the complete word to automatically check your answer
          </p>
        </div>

        {/* Visual representation of the word */}
        <div className="bg-white rounded-lg p-3 mb-3 shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-center">Progress</h3>
          <div className="flex justify-center gap-2">
            {gameState.currentWord.split('').map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 border-2 rounded-lg flex items-center justify-center text-base font-bold transition-all duration-300 ${
                  index < gameState.userInput.length
                    ? gameState.userInput[index] === gameState.currentWord[index]
                      ? 'bg-green-500 text-white border-green-500' // Correct letter - green
                      : 'bg-red-500 text-white border-red-500'     // Wrong letter - red
                    : index < gameState.revealedLetters
                    ? 'bg-green-500 text-white border-green-500'   // Revealed letter - green
                    : 'bg-gray-100 border-gray-300 text-gray-400'  // Empty - gray
                }`}
              >
                {index < gameState.userInput.length
                  ? gameState.userInput[index]
                  : index < gameState.revealedLetters
                  ? gameState.currentWord[index]
                  : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Game Over Screen */}
        {gameState.gameStatus === 'gameOver' && (
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Game Over!</h2>
            <p className="text-2xl mb-2">Final Score: <span className="font-bold text-blue-600">{gameState.score}</span></p>
            <p className="text-gray-600 mb-6">The word was: <span className="font-bold">{gameState.currentWord}</span></p>
            
            {/* Claim Reward Section */}
            {gameState.score > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold mb-2 text-orange-800">🎉 Claim Your Reward!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Earn <span className="font-bold">{gameState.score} Speed Scrabble Stars</span> tokens for your performance!
                </p>
                
                {!isConnected ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Connect your Celo wallet to claim your tokens</p>
                    <WalletConnectButton className="mx-auto" />
                  </div>
                ) : claimState.status === 'idle' ? (
                  <button
                    onClick={handleClaimReward}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-colors shadow-lg"
                  >
                    Claim {gameState.score} Tokens
                  </button>
                ) : claimState.status === 'generating' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-2"></div>
                    <span>Generating signature...</span>
                  </div>
                ) : claimState.status === 'signing' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-2"></div>
                    <span>Please sign the transaction...</span>
                  </div>
                ) : claimState.status === 'pending' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-2"></div>
                    <span>Processing transaction...</span>
                  </div>
                ) : claimState.status === 'success' ? (
                  <div className="text-green-600">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="font-semibold mb-2">Tokens claimed successfully!</p>
                    {writeData && (
                      <a
                        href={`https://celoscan.io/tx/${writeData}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        View on Celoscan
                      </a>
                    )}
                  </div>
                ) : claimState.status === 'error' ? (
                  <div className="text-red-600">
                    <p className="mb-2">❌ {claimState.error}</p>
                    <button
                      onClick={resetClaimState}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : null}
              </div>
            )}
            
            <button
              onClick={startNewGame}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
