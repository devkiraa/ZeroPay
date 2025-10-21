"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  MessageSquare,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Dispute {
  _id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: "open" | "under_review" | "resolved" | "won" | "lost";
  customerEmail: string;
  customerMessage: string;
  merchantResponse?: string;
  createdAt: string;
  merchantId: {
    name: string;
    email: string;
  };
  evidence?: {
    description?: string;
    shippingTracking?: string;
    refundPolicy?: string;
  };
}

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [decision, setDecision] = useState<"merchant" | "customer">("merchant");
  const [notes, setNotes] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDisputes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchDisputes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/disputes?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setDisputes(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch disputes:", error);
    }
    setIsLoading(false);
  };

  const handleResolve = async () => {
    if (!selectedDispute) return;

    setIsResolving(true);
    setMessage("");
    try {
      const res = await fetch(
        `/api/admin/disputes/${selectedDispute._id}/resolve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            decision,
            notes,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage(`Dispute resolved in favor of ${decision}!`);
        setTimeout(() => {
          setSelectedDispute(null);
          setNotes("");
          setMessage("");
          fetchDisputes();
        }, 1500);
      } else {
        setMessage(data.message || "Failed to resolve dispute");
      }
    } catch (error) {
      setMessage("Failed to resolve dispute");
      console.error(error);
    }
    setIsResolving(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "won":
        return "bg-green-100 text-green-800";
      case "lost":
        return "bg-red-100 text-red-800";
      case "resolved":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      fraudulent: "Fraudulent",
      unrecognized: "Unrecognized",
      duplicate: "Duplicate Charge",
      product_not_received: "Product Not Received",
      product_unacceptable: "Product Unacceptable",
      credit_not_processed: "Credit Not Processed",
      other: "Other",
    };
    return labels[reason] || reason;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-light-primary flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          Dispute Management (Admin)
        </h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-light-background text-text-light-primary"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="under_review">Under Review</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {disputes.length === 0 ? (
        <div className="p-12 text-center bg-primary-light rounded-2xl shadow-md">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-text-light-primary mb-2">
            No disputes found
          </h3>
          <p className="text-sm text-text-light-secondary">
            {statusFilter === "all"
              ? "No disputes in the system."
              : `No disputes with status: ${statusFilter}`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {disputes.map((dispute) => (
            <div
              key={dispute._id}
              className="p-6 bg-primary-light rounded-2xl shadow-md border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-light-primary">
                      Order: {dispute.orderId.substring(0, 16)}...
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        dispute.status
                      )}`}
                    >
                      {dispute.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-text-light-secondary">
                    Amount: ₹{dispute.amount} • Reason:{" "}
                    {getReasonLabel(dispute.reason)}
                  </p>
                  <p className="text-sm text-text-light-secondary">
                    Merchant: {dispute.merchantId.name} (
                    {dispute.merchantId.email})
                  </p>
                  <p className="text-sm text-text-light-secondary">
                    Customer: {dispute.customerEmail} •{" "}
                    {new Date(dispute.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Customer Message */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-red-600 mt-0.5" />
                    <span className="text-sm font-medium text-red-900">
                      Customer Message:
                    </span>
                  </div>
                  <p className="text-sm text-red-800 ml-6">
                    {dispute.customerMessage}
                  </p>
                </div>

                {/* Merchant Response */}
                {dispute.merchantResponse && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span className="text-sm font-medium text-blue-900">
                        Merchant Response:
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 ml-6">
                      {dispute.merchantResponse}
                    </p>

                    {/* Evidence */}
                    {dispute.evidence && (
                      <div className="mt-3 ml-6 space-y-1">
                        {dispute.evidence.description && (
                          <p className="text-xs text-blue-700">
                            <strong>Evidence:</strong>{" "}
                            {dispute.evidence.description}
                          </p>
                        )}
                        {dispute.evidence.shippingTracking && (
                          <p className="text-xs text-blue-700">
                            <strong>Tracking:</strong>{" "}
                            {dispute.evidence.shippingTracking}
                          </p>
                        )}
                        {dispute.evidence.refundPolicy && (
                          <p className="text-xs text-blue-700">
                            <strong>Refund Policy:</strong>{" "}
                            <a
                              href={dispute.evidence.refundPolicy}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              View Policy
                            </a>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Resolve Button */}
                {(dispute.status === "open" ||
                  dispute.status === "under_review") && (
                  <button
                    onClick={() => setSelectedDispute(dispute)}
                    className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-emerald-400 transition-colors"
                  >
                    Resolve Dispute
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolution Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl mx-4">
            <h2 className="text-xl font-bold text-text-light-primary mb-4">
              Resolve Dispute
            </h2>
            <p className="text-sm text-text-light-secondary mb-4">
              Order: {selectedDispute.orderId} • Amount: ₹
              {selectedDispute.amount}
            </p>

            <div className="space-y-4">
              {/* Decision */}
              <div>
                <label className="block mb-2 text-sm font-medium text-text-light-primary">
                  Decision *
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDecision("merchant")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      decision === "merchant"
                        ? "border-green-500 bg-green-50 text-green-900"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Merchant Wins</span>
                  </button>
                  <button
                    onClick={() => setDecision("customer")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      decision === "customer"
                        ? "border-red-500 bg-red-50 text-red-900"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <XCircle className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Customer Wins</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block mb-2 text-sm font-medium text-text-light-primary">
                  Resolution Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-light-background text-text-light-primary"
                  placeholder="Explain the reasoning for this decision..."
                />
              </div>

              {message && (
                <p className="text-sm text-center text-accent font-medium">
                  {message}
                </p>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setSelectedDispute(null);
                    setNotes("");
                    setMessage("");
                  }}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={isResolving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolve}
                  disabled={isResolving}
                  className="px-6 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-emerald-400 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                >
                  {isResolving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resolving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Confirm Resolution
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
