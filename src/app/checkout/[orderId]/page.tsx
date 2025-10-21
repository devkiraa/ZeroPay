"use client"; // This is a Client Component

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Building, Loader2, XCircle } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { CheckoutSkeleton } from "@/components/SkeletonLoaders";

type TransactionStatus = "pending" | "success" | "failed" | "loading";
type PaymentMethod = "card" | "upi" | "wallet" | "netbanking";

export default function CheckoutPage() {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [amount, setAmount] = useState<number | null>(null);
  const [status, setStatus] = useState<TransactionStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  // 1. Fetch transaction details (amount) on page load
  useEffect(() => {
    if (orderId) {
      const fetchTransaction = async () => {
        try {
          const res = await fetch(`/api/payment/status/${orderId}`);
          if (!res.ok) throw new Error("Failed to fetch order status");
          const data = await res.json();

          if (data.success) {
            if (data.data.status !== "pending") {
              setError("This payment is already complete.");
              setStatus("failed");
            } else {
              setAmount(data.data.amount);
              setStatus("pending");
            }
          } else {
            throw new Error(data.message || "Error fetching transaction");
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
          setStatus("failed");
        }
      };
      fetchTransaction();
    }
  }, [orderId]);

  // Show skeleton while loading
  if (status === "loading") {
    return <CheckoutSkeleton />;
  }

  // 2. Handle the "Pay Now" button click
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true); // Show spinner

    // Simulate payment processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Call our verification API
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (data.success && data.status === "success") {
        setStatus("success");
        setIsProcessing(false);
        // Redirect to success page
        router.push(`/checkout/success/${orderId}`);
      } else {
        setStatus("failed");
        setIsProcessing(false);
        // Redirect to failed page
        router.push(`/checkout/failed/${orderId}`);
      }
    } catch {
      setStatus("failed");
      setIsProcessing(false);
      router.push(`/checkout/failed/${orderId}`);
    }
  };

  // --- Render Functions for UI states ---

  // Error state (e.g., order not found or already paid)
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="p-8 text-center bg-white rounded-2xl shadow-lg border border-gray-200">
          <XCircle className="w-16 h-16 mx-auto text-status-error" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Payment Error
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-4 py-2 font-medium text-white bg-accent rounded-lg hover:bg-emerald-400 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Main Payment UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Test Mode Banner */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
              TEST MODE
            </span>
            <span className="text-xs text-blue-900">
              This is a simulated payment
            </span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-900">
          ZeroPay Checkout
        </h2>
        <p className="mt-2 text-4xl font-bold text-center text-gray-900">
          ₹{amount?.toFixed(2)}
        </p>
        <p className="mt-1 text-sm text-center text-gray-600">
          Order ID: {orderId.substring(0, 18)}...
        </p>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-2 p-1 mt-6 bg-gray-100 rounded-lg">
          <button
            onClick={() => setMethod("card")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              method === "card"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Card
          </button>
          <button
            onClick={() => setMethod("upi")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              method === "upi"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            UPI
          </button>
          <button
            onClick={() => setMethod("wallet")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              method === "wallet"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setMethod("netbanking")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              method === "netbanking"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Net Banking
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {method === "card" && (
            <>
              {/* Card Details */}
              <div>
                <label
                  htmlFor="card-number"
                  className="block mb-1 text-sm font-medium text-gray-900"
                >
                  Card Number
                </label>
                <div className="relative">
                  <input
                    id="card-number"
                    type="text"
                    required
                    defaultValue="4242 4242 4242 4242" // Mock data
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <CreditCard className="absolute w-5 h-5 top-3.5 right-4 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiry"
                    className="block mb-1 text-sm font-medium text-gray-900"
                  >
                    Expiry (MM/YY)
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    required
                    defaultValue="12/28" // Mock data
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvc"
                    className="block mb-1 text-sm font-medium text-gray-900"
                  >
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    required
                    defaultValue="123" // Mock data
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </>
          )}

          {method === "upi" && (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="flex flex-col items-center py-4">
                <p className="mb-4 text-sm font-medium text-gray-900">
                  Scan QR Code to Pay
                </p>
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                  <QRCodeCanvas
                    value={`upi://pay?pa=merchant@zeropay&pn=ZeroPay&am=${amount}&cu=INR`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-600 text-center">
                  Scan with any UPI app
                </p>
              </div>
              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              {/* UPI Details */}
              <label
                htmlFor="upi-id"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Enter UPI ID
              </label>
              <div className="relative">
                <input
                  id="upi-id"
                  type="text"
                  required
                  defaultValue="developer@zeropay" // Mock data
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Building className="absolute w-5 h-5 top-3.5 right-4 text-gray-400" />
              </div>
            </div>
          )}

          {method === "wallet" && (
            <div className="space-y-4">
              <label
                htmlFor="wallet-select"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Select Wallet
              </label>
              <select
                id="wallet-select"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
                <option value="googlepay">Google Pay</option>
                <option value="amazonpay">Amazon Pay</option>
              </select>
              <label
                htmlFor="wallet-id"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Wallet ID / Mobile Number
              </label>
              <input
                id="wallet-id"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          {method === "netbanking" && (
            <div className="space-y-4">
              <label
                htmlFor="bank-select"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Select Bank
              </label>
              <select
                id="bank-select"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
              <label
                htmlFor="account-number"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Account Number
              </label>
              <input
                id="account-number"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          {/* Pay Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full px-4 py-3 font-medium text-white bg-accent rounded-lg shadow-md transition-all duration-300 hover:bg-emerald-400 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
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
