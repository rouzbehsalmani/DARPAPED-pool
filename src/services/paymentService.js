// src/services/paymentService.js
//
// PHASE 9 INTEGRATION POINT for real wallet top-ups and withdrawals. The
// Wallet screen only ever calls initiateTopUp / submitWithdrawal - today
// both are fully simulated (TEST MODE, no real money moves). Swap the
// internals for a real payment gateway later without touching app/wallet.js.
//
// TODO(Phase 9 - real gateway), roughly:
//   Top-ups: create a Stripe PaymentIntent on your backend, confirm it here
//     with @stripe/stripe-react-native using EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY.
//   Withdrawals: POST to your backend, which queues a real payout (PayPal
//     Payouts API, bank transfer, or on-chain transfer) and reports status
//     back via API polling or a webhook -> push notification.
// Env var placeholders already exist in .env.example.

export const TOPUP_OPTIONS = [1, 5, 10, 25];

export const WITHDRAWAL_METHODS = [
  { id: "paypal", label: "PayPal" },
  { id: "bank", label: "Bank Transfer" },
  { id: "crypto", label: "Crypto Wallet" }
];

export function initiateTopUp(amountUsd) {
  // TODO(Phase 9): replace with a real Stripe/PayPal charge + confirmation.
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, amountUsd }), 800);
  });
}

export function submitWithdrawal(amountUsd, methodId, destination) {
  // TODO(Phase 9): replace with a real backend call that queues the payout
  // and returns a tracked requestId your backend can update later.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        requestId: `wd_${Date.now()}`,
        amountUsd,
        methodId,
        destination,
        status: "pending"
      });
    }, 800);
  });
}

// FILE LOCATION: src/services/paymentService.js (NEW file)
