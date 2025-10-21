'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface Transaction {
  _id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  customerEmail: string;
  merchantName: string;
  merchantEmail: string;
  createdAt: string;
}

interface AdminTransactionsClientProps {
  initialTransactions: Transaction[];
}

export default function AdminTransactionsClient({ initialTransactions }: AdminTransactionsClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusUpdate = async (transactionId: string, newStatus: string) => {
    setUpdating(transactionId);

    try {
      const res = await fetch('/api/admin/transactions/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, status: newStatus }),
      });

      if (res.ok) {
        setTransactions(prev =>
          prev.map(tx =>
            tx._id === transactionId ? { ...tx, status: newStatus } : tx
          )
        );
      } else {
        alert('Failed to update transaction status');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred while updating the transaction');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Merchant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {tx.orderId.substring(0, 20)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div>
                      <div className="font-medium">{tx.merchantName}</div>
                      <div className="text-xs text-gray-500">{tx.merchantEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {tx.customerEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 uppercase">
                    {tx.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tx.status !== 'refunded' && (
                      <select
                        value={tx.status}
                        onChange={(e) => handleStatusUpdate(tx._id, e.target.value)}
                        disabled={updating === tx._id}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    )}
                    {updating === tx._id && (
                      <RefreshCw className="inline w-4 h-4 ml-2 animate-spin" />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
