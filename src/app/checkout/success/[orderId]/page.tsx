// src/app/checkout/success/[orderId]/page.tsx
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 text-center bg-white rounded-2xl shadow-lg">
        <CheckCircle className="w-20 h-20 mx-auto text-status-success" />
        <h1 className="mt-6 text-3xl font-bold text-text-light-primary">
          Payment Successful!
        </h1>
        <p className="mt-2 text-text-light-secondary">
          Thank you for your payment.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Order ID: {params.orderId}
        </p>
        <Link
          href="/merchant/dashboard" // Link back to dashboard for this demo
          className="inline-block mt-8 px-6 py-3 font-medium text-white bg-accent rounded-lg shadow-md hover:bg-emerald-400"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}