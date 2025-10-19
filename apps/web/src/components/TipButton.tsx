'use client';

import { useState } from 'react';
import { Heart, CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getStripe } from '@/lib/stripe';

type PaymentState = 'idle' | 'processing' | 'success' | 'error';

interface TipButtonProps {
  className?: string;
}

export default function TipButton({ className = '' }: TipButtonProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleTip = async () => {
    try {
      setPaymentState('processing');
      setErrorMessage('');

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), // $10.00
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const { clientSecret } = await response.json();

      // Redirect to our payment page with the client secret
      window.location.href = `/tip-payment?client_secret=${clientSecret}`;

    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
      setPaymentState('error');
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setPaymentState('idle');
        setErrorMessage('');
      }, 3000);
    }
  };

  const renderButtonContent = () => {
    switch (paymentState) {
      case 'processing':
        return (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Thank you!</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            <span>Try Again</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Tip $10</span>
          </div>
        );
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <button
        onClick={handleTip}
        disabled={paymentState === 'processing'}
        className={`apple-button-secondary flex items-center gap-2 mx-auto transition-all duration-200 ${
          paymentState === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : paymentState === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : ''
        } ${paymentState === 'processing' ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {renderButtonContent()}
      </button>
      
      {errorMessage && (
        <p className="apple-text-small text-red-600 mt-2 max-w-xs mx-auto">
          {errorMessage}
        </p>
      )}
      
      {paymentState === 'idle' && (
        <p className="apple-text-small mt-2">
          Support the developer with an optional tip
        </p>
      )}
    </div>
  );
}
