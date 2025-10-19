'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // In a real app, you might want to verify the payment on the server
    // For now, we'll just check if we have a payment intent ID
    if (paymentIntent) {
      setIsVerified(true);
    }
  }, [paymentIntent]);

  return (
    <div className="apple-card p-8 max-w-md mx-auto text-center apple-fade-in">
      <div className="mb-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="apple-text-large text-black mb-3">
          Thank You! 🎉
        </h2>
        <p className="apple-text-body mb-4">
          Your $10 tip has been successfully processed. Your support means the world to us!
        </p>
        
        {isVerified && paymentIntent && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="apple-text-small text-gray-600 mb-1">Payment ID:</p>
            <p className="font-mono text-xs text-gray-800 break-all">
              {paymentIntent}
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-6 text-red-500">
          <Heart className="h-5 w-5 fill-current" />
          <span className="apple-text-body font-medium">Made with love</span>
          <Heart className="h-5 w-5 fill-current" />
        </div>
      </div>

      <div className="space-y-3">
        <Link href="/">
          <button className="apple-button-primary w-full flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Game
          </button>
        </Link>
        
        <p className="apple-text-small">
          Ready to play some more Speed Scrabbler?
        </p>
      </div>
    </div>
  );
}

export default function TipSuccessPage() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="apple-text-large text-black mb-3">Payment Successful</h1>
          <p className="apple-text-body">
            Thank you for supporting Speed Scrabbler!
          </p>
        </div>

        <Suspense fallback={
          <div className="apple-card p-8 max-w-md mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="apple-text-body">Confirming your payment...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
