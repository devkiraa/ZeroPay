import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import Merchant from "@/models/Merchant";
import AdminTransactionsClient from "@/components/AdminTransactionsClient";
import { AdminTransactionsSkeleton } from "@/components/SkeletonLoaders";
import { Suspense } from "react";

async function getAllTransactions() {
  await dbConnect();

  const transactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(100); // Limit to recent 100 transactions

  const merchantIds = [
    ...new Set(transactions.map((tx) => String(tx.merchantId))),
  ];
  const merchants = await Merchant.find({ _id: { $in: merchantIds } }).select(
    "name email"
  );

  const merchantMap = new Map(
    merchants.map((m) => [String(m._id), { name: m.name, email: m.email }])
  );

  const transactionsWithMerchant = transactions.map((tx) => ({
    ...JSON.parse(JSON.stringify(tx)),
    merchantName: merchantMap.get(String(tx.merchantId))?.name || "Unknown",
    merchantEmail: merchantMap.get(String(tx.merchantId))?.email || "Unknown",
  }));

  return transactionsWithMerchant;
}

export default async function AdminTransactionsPage() {
  const transactions = await getAllTransactions();

  return (
    <Suspense fallback={<AdminTransactionsSkeleton />}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All Transactions
        </h2>
        <AdminTransactionsClient initialTransactions={transactions} />
      </div>
    </Suspense>
  );
}
