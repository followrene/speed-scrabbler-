'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Payment form component
function PaymentForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/tip-success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="apple-card p-6 max-w-md mx-auto">
      <h2 className="apple-text-medium text-black mb-4 text-center">
        Support Speed Scrabbler
      </h2>
      <p className="apple-text-body mb-6 text-center">
        Your $10 tip helps support the development of this game. Thank you!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement />
        
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="apple-text-small text-red-600">{errorMessage}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Link href="/" className="flex-1">
            <button
              type="button"
              className="apple-button-secondary w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </button>
          </Link>
          
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="apple-button-primary flex-1 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay $10'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Main payment page component
function TipPaymentContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('client_secret');
  const [stripePromise] = useState(() => getStripe());

  if (!clientSecret) {
    return (
      <div className="apple-card p-6 max-w-md mx-auto text-center">
        <h2 className="apple-text-medium text-black mb-4">Invalid Payment Link</h2>
        <p className="apple-text-body mb-6">
          This payment link is invalid or has expired.
        </p>
        <Link href="/">
          <button className="apple-button-primary">
            Back to Game
          </button>
        </Link>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#000000',
        colorBackground: '#ffffff',
        colorText: '#000000',
        colorDanger: '#ff3b30',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm clientSecret={clientSecret} />
    </Elements>
  );
}

export default function TipPaymentPage() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="apple-text-large text-black mb-3">Tip Payment</h1>
          <p className="apple-text-body">
            Complete your payment to support Speed Scrabbler development
          </p>
        </div>

        <Suspense fallback={
          <div className="apple-card p-6 max-w-md mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="apple-text-body">Loading payment form...</p>
          </div>
        }>
          <TipPaymentContent />
        </Suspense>
      </div>
    </main>
  );
}
