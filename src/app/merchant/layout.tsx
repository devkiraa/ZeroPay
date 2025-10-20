import Sidebar from '@/components/Sidebar';
import LogoutButton from '@/components/LogoutButton';
import { Bell, UserCircle } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-light-background text-text-light-primary">
      {/* Sidebar (Stays dark for contrast) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Topbar (Light theme) */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 bg-primary-light/80 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-4">
            {/* TODO: Mobile sidebar toggle */}
            <h1 className="text-xl font-semibold text-text-light-primary">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 transition-colors rounded-full text-text-light-secondary hover:bg-gray-100 hover:text-text-light-primary">
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-accent ring-2 ring-primary-light" />
            </button>
            <UserCircle className="w-8 h-8 text-text-light-secondary" />
            <div className="hidden md:block">
              {/* LogoutButton component will need its styles updated next */}
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Page Content (Light background) */}
        <main className="flex-1 p-4 md:p-8 bg-light-background">
          {children}
        </main>
      </div>
    </div>
  );
}