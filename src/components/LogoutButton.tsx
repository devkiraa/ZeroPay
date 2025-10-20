'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    router.push('/merchant/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg text-text-light-secondary hover:bg-red-100 hover:text-status-error"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}