export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-gray-200 rounded-2xl h-32"></div>
        ))}
      </div>

      {/* Recent Transactions Skeleton */}
      <div className="p-6 bg-gray-200 rounded-2xl">
        <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="p-6 bg-gray-200 rounded-2xl">
        <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-20 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ApiKeysSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="p-6 bg-gray-200 rounded-2xl">
        <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="h-12 bg-gray-300 rounded mb-4"></div>
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>

      <div className="p-6 bg-gray-200 rounded-2xl">
        <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WebhooksSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="p-6 bg-gray-200 rounded-2xl">
        <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="h-12 bg-gray-300 rounded mb-4"></div>
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>

      <div className="p-6 bg-gray-200 rounded-2xl">
        <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-xl mx-auto py-10 px-4 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="max-w-xl mx-auto py-10 px-4 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
        <div className="flex gap-6 mb-6">
          <div className="h-6 bg-gray-300 rounded w-40"></div>
          <div className="h-6 bg-gray-300 rounded w-40"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-48 mb-6 mx-auto"></div>
        <div className="h-12 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-gray-300 rounded w-64 mb-6"></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-gray-200 rounded-2xl h-32"></div>
        ))}
      </div>

      <div className="p-6 bg-gray-200 rounded-2xl">
        <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminTransactionsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-300 rounded w-64 mb-6"></div>
      <div className="p-6 bg-gray-200 rounded-2xl">
        <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="h-20 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminMerchantsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-300 rounded w-64 mb-6"></div>
      <div className="p-6 bg-gray-200 rounded-2xl">
        <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
