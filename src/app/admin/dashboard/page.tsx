import dbConnect from "@/lib/dbConnect";
import Merchant from "@/models/Merchant";
import Transaction from "@/models/Transaction";
import { AdminDashboardSkeleton } from "@/components/SkeletonLoaders";
import { Suspense } from "react";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";

async function getSystemStats() {
  await dbConnect();

  const totalMerchants = await Merchant.countDocuments();
  const transactions = await Transaction.find();

  const totalRevenue = transactions
    .filter((tx) => tx.status === "success")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const successfulTransactions = transactions.filter(
    (tx) => tx.status === "success"
  ).length;
  const totalTransactions = transactions.length;
  const successRate =
    totalTransactions > 0
      ? Math.round((successfulTransactions / totalTransactions) * 100)
      : 0;

  return {
    totalMerchants,
    totalRevenue,
    totalTransactions,
    successRate,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getSystemStats();

  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          System Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Merchants */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Merchants
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalMerchants}
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>

          {/* Total Transactions */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Transactions
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalTransactions}
            </p>
          </div>

          {/* Success Rate */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Success Rate
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.successRate}%
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Use the sidebar to navigate to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>View all merchants and their details</li>
              <li>Monitor all transactions across the platform</li>
              <li>Update transaction statuses as needed</li>
            </ul>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
