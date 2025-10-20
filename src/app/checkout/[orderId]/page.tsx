'use client'; // This is a Client Component

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CreditCard,
  Building,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

type TransactionStatus = 'pending' | 'success' | 'failed' | 'loading';
type PaymentMethod = 'card' | 'upi';

export default function CheckoutPage() {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [amount, setAmount] = useState<number | null>(null);
  const [status, setStatus] = useState<TransactionStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  // 1. Fetch transaction details (amount) on page load
  useEffect(() => {
    if (orderId) {
      const fetchTransaction = async () => {
        try {
          const res = await fetch(`/api/payment/status/${orderId}`);
          if (!res.ok) throw new Error('Failed to fetch order status');
          const data = await res.json();

          if (data.success) {
            if (data.data.status !== 'pending') {
              setError('This payment is already complete.');
              setStatus('failed');
            } else {
              setAmount(data.data.amount);
              setStatus('pending');
            }
          } else {
            throw new Error(data.message || 'Error fetching transaction');
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'An unknown error occurred'
          );
          setStatus('failed');
        }
      };
      fetchTransaction();
    }
  }, [orderId]);

  // 2. Handle the "Pay Now" button click
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading'); // Show spinner

    // Simulate payment processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Call our verification API
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (data.success && data.status === 'success') {
        setStatus('success');
        // Redirect to success page
        router.push(`/checkout/success/${orderId}`);
      } else {
        setStatus('failed');
        // Redirect to failed page
        router.push(`/checkout/failed/${orderId}`);
      }
    } catch (err) {
      setStatus('failed');
      router.push(`/checkout/failed/${orderId}`);
    }
  };

  // --- Render Functions for UI states ---

  // Loading spinner while fetching amount
  if (status === 'loading' && amount === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  // Error state (e.g., order not found or already paid)
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center bg-white rounded-2xl shadow-lg">
          <XCircle className="w-16 h-16 mx-auto text-status-error" />
          <h2 className="mt-4 text-2xl font-bold text-text-light-primary">
            Payment Error
          </h2>
          <p className="mt-2 text-text-light-secondary">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Main Payment UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/30 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 bg-primary-light rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-center text-text-light-secondary">
          ZeroPay Checkout
        </h2>
        <p className="mt-2 text-4xl font-bold text-center text-text-light-primary">
          ₹{amount?.toFixed(2)}
        </p>
        <p className="mt-1 text-sm text-center text-text-light-secondary">
          Order ID: {orderId.substring(0, 18)}...
        </p>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 mt-6 bg-gray-100 rounded-lg">
          <button
            onClick={() => setMethod('card')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              method === 'card'
                ? 'bg-white shadow-sm text-text-light-primary'
                : 'text-text-light-secondary hover:bg-gray-200'
            }`}
          >
            Card
          </button>
          <button
            onClick={() => setMethod('upi')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              method === 'upi'
                ? 'bg-white shadow-sm text-text-light-primary'
                : 'text-text-light-secondary hover:bg-gray-200'
            }`}
          >
            UPI / Wallet
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {method === 'card' && (
            <>
              {/* Card Details */}
              <div>
                <label
                  htmlFor="card-number"
                  className="block mb-1 text-sm font-medium text-text-light-secondary"
                >
                  Card Number
                </label>
                <div className="relative">
                  <input
                    id="card-number"
                    type="text"
                    required
                    defaultValue="4242 4242 4242 4242" // Mock data
                    className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <CreditCard className="absolute w-5 h-5 top-3.5 right-4 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiry"
                    className="block mb-1 text-sm font-medium text-text-light-secondary"
                  >
                    Expiry (MM/YY)
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    required
                    defaultValue="12/28" // Mock data
                    className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvc"
                    className="block mb-1 text-sm font-medium text-text-light-secondary"
                  >
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    required
                    defaultValue="123" // Mock data
                    className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </>
          )}

          {method === 'upi' && (
            <div>
              {/* UPI Details */}
              <label
                htmlFor="upi-id"
                className="block mb-1 text-sm font-medium text-text-light-secondary"
              >
                Enter UPI ID
              </label>
              <div className="relative">
                <input
                  id="upi-id"
                  type="text"
                  required
                  defaultValue="developer@zeropay" // Mock data
                  className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Building className="absolute w-5 h-5 top-3.5 right-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* Pay Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-4 py-3 font-medium text-primary-dark bg-accent rounded-lg shadow-md transition-all duration-300 hover:bg-emerald-400 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <Loader2 className="w-6 h-6 mx-auto animate-spin" />
              ) : (
                `Pay ₹${amount?.toFixed(2)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}