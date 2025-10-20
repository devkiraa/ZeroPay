'use client'; // This is the Client Component

import {
  DollarSign,
  Percent,
  ArrowRightLeft,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { IMerchant } from '@/models/Merchant';
import { ITransaction } from '@/models/Transaction';

// Define the prop types this component expects
type DashboardClientProps = {
  merchant: IMerchant;
  transactions: ITransaction[];
  analytics: {
    totalRevenue: number;
    successRate: number;
    refunds: number;
  };
};

// Mock chart data (as before)
const chartData = [
  { name: 'Mon', revenue: 400 },
  { name: 'Tue', revenue: 300 },
  { name: 'Wed', revenue: 600 },
  { name: 'Thu', revenue: 800 },
  { name: 'Fri', revenue: 500 },
  { name: 'Sat', revenue: 700 },
  { name: 'Sun', revenue: 900 },
];

// This is the Client-side chart component (Light Theme)
function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#64748B" // text-text-light-secondary
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#64748B" // text-text-light-secondary
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFFF', // bg-primary-light
            border: '1px solid #E2E8F0', // border-gray-200
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#0F172A' }} // text-text-light-primary
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#10B981" // accent
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// This is our main Client Component (Light Theme)
export default function DashboardClient({
  transactions,
  analytics,
}: DashboardClientProps) {
  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Revenue */}
        <div className="p-5 rounded-2xl bg-primary-light shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-light-secondary">
              Total Revenue
            </p>
            <DollarSign className="w-5 h-5 text-text-light-secondary" />
          </div>
          <p className="text-3xl font-bold text-text-light-primary">
            ${analytics.totalRevenue.toFixed(2)}
          </p>
        </div>
        {/* Card 2: Success Rate */}
        <div className="p-5 rounded-2xl bg-primary-light shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-light-secondary">
              Success Rate
            </p>
            <Percent className="w-5 h-5 text-text-light-secondary" />
          </div>
          <p className="text-3xl font-bold text-text-light-primary">
            {analytics.successRate}%
          </p>
        </div>
        {/* Card 3: Refunds */}
        <div className="p-5 rounded-2xl bg-primary-light shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-light-secondary">
              Refunds Processed
            </p>
            <ArrowRightLeft className="w-5 h-5 text-text-light-secondary" />
          </div>
          <p className="text-3xl font-bold text-text-light-primary">
            {analytics.refunds}
          </p>
        </div>
        {/* Card 4: Total Transactions */}
        <div className="p-5 rounded-2xl bg-primary-light shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-light-secondary">
              Total Transactions
            </p>
            <CheckCircle className="w-5 h-5 text-text-light-secondary" />
          </div>
          <p className="text-3xl font-bold text-text-light-primary">
            {transactions.length}
          </p>
        </div>
      </div>

      {/* 2. Revenue Graph */}
      <div className="p-5 rounded-2xl bg-primary-light shadow-md">
        <h3 className="mb-4 text-xl font-semibold text-text-light-primary">
          Revenue Trend
        </h3>
        <DashboardChart />
      </div>

      {/* 3. Recent Transactions Table */}
      <div className="p-5 rounded-2xl bg-primary-light shadow-md">
        <h3 className="mb-4 text-xl font-semibold text-text-light-primary">
          Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Order ID
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Amount
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-light-secondary">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr
                    key={tx.orderId}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-text-light-primary whitespace-nowrap">
                      {tx.orderId.substring(0, 12)}...
                    </td>
                    <td className="px-4 py-3 text-sm text-text-light-primary whitespace-nowrap">
                      {tx.currency} {tx.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {/* Light-theme status badges */}
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-light-secondary whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-sm text-center text-text-light-secondary"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}   