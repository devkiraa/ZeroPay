"use client"; // For using usePathname hook

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowRightLeft,
  KeyRound,
  Webhook,
  User,
  Zap,
  Settings,
  BookOpen,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/merchant/dashboard", icon: LayoutDashboard },
  {
    name: "Transactions",
    href: "/merchant/transactions",
    icon: ArrowRightLeft,
  },
  { name: "API Keys", href: "/merchant/apikeys", icon: KeyRound },
  { name: "Webhooks", href: "/merchant/webhooks", icon: Webhook },
  { name: "Profile", href: "/merchant/profile", icon: User },
  { name: "Settings", href: "/merchant/settings", icon: Settings },
  { name: "API Docs", href: "/devportal", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    // Sidebar uses the dark theme palette
    <aside className="hidden w-64 h-screen p-4 md:flex md:flex-col bg-primary-dark shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <Zap className="w-8 h-8 text-accent" />
        <span className="text-2xl font-bold text-primary-light">ZeroPay</span>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${
                    pathname === item.href
                      ? "bg-accent text-primary-dark font-medium" // Active link
                      : "text-text-dark-secondary hover:bg-secondary hover:text-primary-light" // Inactive link
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 text-sm text-text-dark-secondary">
        <p>© {new Date().getFullYear()} ZeroPay</p>
      </div>
    </aside>
  );
}
