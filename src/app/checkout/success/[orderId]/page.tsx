// src/app/checkout/success/[orderId]/page.tsx
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-10 text-center bg-white rounded-2xl shadow-lg border border-gray-200">
        <CheckCircle className="w-20 h-20 mx-auto text-status-success" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Successful!
        </h1>
        <p className="mt-2 text-gray-600">Thank you for your payment.</p>
        <p className="mt-1 text-sm text-gray-500">Order ID: {params.orderId}</p>
        <Link
          href="/merchant/dashboard" // Link back to dashboard for this demo
          className="inline-block mt-8 px-6 py-3 font-medium text-white bg-accent rounded-lg shadow-md hover:bg-emerald-400 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
