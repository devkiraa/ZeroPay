import dbConnect from "@/lib/dbConnect";
import Merchant from "@/models/Merchant";
import { AdminMerchantsSkeleton } from "@/components/SkeletonLoaders";
import { Suspense } from "react";

async function getAllMerchants() {
  await dbConnect();
  const merchants = await Merchant.find()
    .select("-passwordHash -secretKey")
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(merchants));
}

export default async function AdminMerchantsPage() {
  const merchants = await getAllMerchants();

  return (
    <Suspense fallback={<AdminMerchantsSkeleton />}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Merchants</h2>

        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Public Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {merchants.length > 0 ? (
                merchants.map(
                  (merchant: {
                    _id: unknown;
                    name: string;
                    email: string;
                    publicKey: string;
                    createdAt: string;
                  }) => (
                    <tr key={String(merchant._id)} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {merchant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {merchant.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        {merchant.publicKey}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(merchant.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No merchants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Secret keys are hidden for security.
            Merchants can regenerate their own keys from their dashboard.
          </p>
        </div>
      </div>
    </Suspense>
  );
}
