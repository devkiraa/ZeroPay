'use client';

import { useState, useMemo } from 'react';
import { ITransaction } from '@/models/Transaction';
import { Search, SlidersHorizontal } from 'lucide-react';

type TransactionsClientProps = {
  transactions: ITransaction[];
};

export default function TransactionsClient({
  transactions,
}: TransactionsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const searchMatch =
        tx.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        statusFilter === 'all' || tx.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [transactions, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-text-light-primary">
          All Transactions
        </h2>

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
                          tx.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : tx.status === 'refunded'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-sm text-center text-text-light-secondary"
                  >
                    {transactions.length === 0
                      ? 'No transactions found.'
                      : 'No transactions match your filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* TODO: Add Pagination controls here */}
      </div>
    </div>
  );
}