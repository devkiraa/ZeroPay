"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ITransaction } from "@/models/Transaction";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type TransactionsClientProps = {
  transactions: ITransaction[];
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
};

export default function TransactionsClient({
  transactions,
  currentPage,
  totalPages,
  totalTransactions,
}: TransactionsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refundTx, setRefundTx] = useState<ITransaction | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundMessage, setRefundMessage] = useState("");
  const router = useRouter();

  // Filter logic (client-side filtering within the current page)
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const searchMatch =
        tx.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === "all" || tx.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [transactions, searchTerm, statusFilter]);

  const handlePageChange = (newPage: number) => {
    router.push(`/merchant/transactions?page=${newPage}`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-light-primary">
            All Transactions
          </h2>
          <p className="text-sm text-text-light-secondary">
            {totalTransactions} total transaction
            {totalTransactions !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by Order ID or Email..."
              className="w-full px-4 py-3 pl-10 rounded-lg bg-light-background border border-gray-300 text-text-light-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute w-5 h-5 top-3.5 left-3 text-gray-400" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              className="w-full px-4 py-3 pr-10 appearance-none rounded-lg bg-light-background border border-gray-300 text-text-light-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <SlidersHorizontal className="absolute w-5 h-5 top-3.5 right-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Order ID
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Mode
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Amount
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Method
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Customer Email
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.orderId}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-text-light-primary whitespace-nowrap">
                      {tx.orderId.substring(0, 12)}...
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.isTestMode
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {tx.isTestMode ? "Test" : "Live"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === "success"
                            ? "bg-green-100 text-green-800"
                            : tx.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : tx.status === "refunded"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-light-primary whitespace-nowrap">
                      {tx.currency} {tx.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-light-secondary whitespace-nowrap">
                      {tx.method}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-light-secondary whitespace-nowrap">
                      {tx.customerEmail}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-light-secondary whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-light-secondary whitespace-nowrap">
                      {tx.status === "success" && (
                        <button
                          className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                          onClick={() => {
                            setRefundTx(tx);
                            setRefundAmount(tx.amount.toString());
                            setRefundReason("");
                            setRefundMessage("");
                          }}
                        >
                          Refund
                        </button>
                      )}
                      {tx.status === "refunded" && tx.refundedAmount && (
                        <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-lg">
                          Refunded ₹{tx.refundedAmount}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-4 text-sm text-center text-text-light-secondary"
                  >
                    {transactions.length === 0
                      ? "No transactions found."
                      : "No transactions match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Refund Modal */}
        {refundTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
              <h3 className="mb-4 text-xl font-semibold text-text-light-primary">
                Refund Transaction
              </h3>
              <p className="mb-2 text-sm text-text-light-secondary">
                Order ID: <span className="font-mono">{refundTx.orderId}</span>
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setRefundLoading(true);
                  setRefundMessage("");
                  try {
                    const res = await fetch("/api/merchant/payment/refund", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        orderId: refundTx.orderId,
                        amount: Number(refundAmount),
                        reason: refundReason,
                      }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setRefundMessage("Refund successful!");
                      setTimeout(() => {
                        setRefundTx(null);
                        router.refresh();
                      }, 1200);
                    } else {
                      setRefundMessage(data.message || "Refund failed");
                    }
                  } catch {
                    setRefundMessage("Refund failed");
                  }
                  setRefundLoading(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="refund-amount"
                    className="block mb-1 text-sm font-medium text-text-light-secondary"
                  >
                    Refund Amount
                  </label>
                  <input
                    id="refund-amount"
                    type="number"
                    min={1}
                    max={refundTx.amount}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="refund-reason"
                    className="block mb-1 text-sm font-medium text-text-light-secondary"
                  >
                    Reason (optional)
                  </label>
                  <input
                    id="refund-reason"
                    type="text"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                {refundMessage && (
                  <div className="text-sm text-center text-green-700 bg-green-100 border border-green-300 rounded-lg px-4 py-2">
                    {refundMessage}
                  </div>
                )}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    onClick={() => setRefundTx(null)}
                    disabled={refundLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    disabled={refundLoading}
                  >
                    {refundLoading ? "Processing..." : "Refund"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-text-light-secondary">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-text-light-primary bg-light-background border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-text-light-primary bg-light-background border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
