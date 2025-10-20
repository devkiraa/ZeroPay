// src/app/checkout/failed/[orderId]/page.tsx
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentFailed({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 text-center bg-white rounded-2xl shadow-lg">
        <XCircle className="w-20 h-20 mx-auto text-status-error" />
        <h1 className="mt-6 text-3xl font-bold text-text-light-primary">
          Payment Failed
        </h1>
        <p className="mt-2 text-text-light-secondary">
          Your payment could not be processed.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Order ID: {params.orderId}
        </p>
        <Link
          href={`/checkout/${params.orderId}`} // Link back to retry
          className="inline-block mt-8 px-6 py-3 font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}