"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Activity,
  PieChart as PieChartIcon,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  averageTransactionValue: number;
  revenueByDay: { date: string; revenue: number }[];
  transactionsByMethod: { method: string; count: number; revenue: number }[];
  transactionsByStatus: { status: string; count: number }[];
  recentTrends: { period: string; transactions: number; revenue: number }[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
const STATUS_COLORS: Record<string, string> = {
  success: "#10b981",
  failed: "#ef4444",
  pending: "#f59e0b",
  refunded: "#8b5cf6",
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/merchant/analytics?range=${timeRange}`);
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center text-text-light-secondary">
        Failed to load analytics data
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-light-primary">
          Analytics Dashboard
        </h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as "7d" | "30d" | "90d")}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-light-background text-text-light-primary"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-primary-light rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-accent" />
          </div>
          <p className="text-sm text-text-light-secondary">Total Revenue</p>
          <p className="text-3xl font-bold text-text-light-primary">
            ₹{analytics.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="p-6 bg-primary-light rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-text-light-secondary">
            Total Transactions
          </p>
          <p className="text-3xl font-bold text-text-light-primary">
            {analytics.totalTransactions}
          </p>
        </div>

        <div className="p-6 bg-primary-light rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-text-light-secondary">Success Rate</p>
          <p className="text-3xl font-bold text-text-light-primary">
            {analytics.successRate.toFixed(1)}%
          </p>
        </div>

        <div className="p-6 bg-primary-light rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-text-light-secondary">Avg Transaction</p>
          <p className="text-3xl font-bold text-text-light-primary">
            ₹{analytics.averageTransactionValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Revenue Over Time */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-text-light-primary mb-4">
          Revenue Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.revenueByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Methods & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="p-6 bg-primary-light rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-text-light-primary mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Payment Methods
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.transactionsByMethod}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.method}: ${entry.count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.transactionsByMethod.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {analytics.transactionsByMethod.map((method, index) => (
              <div
                key={method.method}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-text-light-secondary capitalize">
                    {method.method}
                  </span>
                </div>
                <div className="text-text-light-primary font-medium">
                  {method.count} (₹{method.revenue.toLocaleString()})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Status */}
        <div className="p-6 bg-primary-light rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-text-light-primary mb-4">
            Transaction Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.transactionsByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="status" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {analytics.transactionsByStatus.map((entry) => (
                  <Cell
                    key={`cell-${entry.status}`}
                    fill={STATUS_COLORS[entry.status] || "#6b7280"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Trends */}
      <div className="p-6 bg-primary-light rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-text-light-primary mb-4">
          Transaction Trends
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary">
                  Period
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-light-secondary">
                  Transactions
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-light-secondary">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentTrends.map((trend, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-text-light-primary">
                    {trend.period}
                  </td>
                  <td className="text-right py-3 px-4 text-sm text-text-light-primary font-medium">
                    {trend.transactions}
                  </td>
                  <td className="text-right py-3 px-4 text-sm text-text-light-primary font-medium">
                    ₹{trend.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
