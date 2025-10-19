# Stripe Integration Setup

This document explains how to set up Stripe payments for the Speed Scrabbler tip functionality.

## Required Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Stripe Configuration
# Get these from your Stripe Dashboard: https://dashboard.stripe.com/apikeys
# Use test keys for development, live keys for production
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here
```

## Getting Your Stripe Keys

1. **Create a Stripe Account**
   - Go to [https://stripe.com](https://stripe.com) and sign up
   - Complete the account verification process

2. **Get Your API Keys**
   - Go to [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
   - Copy your **Publishable key** (starts with `pk_test_` for test mode)
   - Copy your **Secret key** (starts with `sk_test_` for test mode)

3. **Add Keys to Environment**
   ```bash
   # Add to apps/web/.env.local
   STRIPE_SECRET_KEY=sk_test_51ABC123...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...
   ```

## Test Mode vs Live Mode

- **Test Mode**: Use `sk_test_` and `pk_test_` keys for development
- **Live Mode**: Use `sk_live_` and `pk_live_` keys for production

## Testing Payments

In test mode, you can use these test card numbers:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

## Features Implemented

- ✅ $10 tip button on homepage
- ✅ Secure payment processing with Stripe Elements
- ✅ Apple-inspired payment form design
- ✅ Success and error handling
- ✅ Payment confirmation page
- ✅ Mobile-responsive design

## Security Notes

- Secret keys are only used server-side
- Publishable keys are safe to expose in client-side code
- All payments are processed securely through Stripe
- No card details are stored on our servers

## Webhook Setup (Optional)

For production, you may want to set up webhooks to handle payment events:

1. Go to [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Add webhook signing secret to environment variables

## Support

For Stripe-related issues, check:
- [Stripe Documentation](https://docs.stripe.com)
- [Stripe Support](https://support.stripe.com)
