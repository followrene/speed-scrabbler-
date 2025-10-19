import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount = STRIPE_CONFIG.tipAmount } = body;

    // Validate amount (minimum $1, maximum $100 for tips)
    if (amount < 100 || amount > 10000) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be between $1 and $100.' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: STRIPE_CONFIG.currency,
      description: STRIPE_CONFIG.tipDescription,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: 'tip',
        game: 'speed-scrabbler',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Payment setup failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while setting up payment.' },
      { status: 500 }
    );
  }
}
