import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Shield, LogOut } from "lucide-react";
import Link from "next/link";

interface TokenPayload extends JwtPayload {
  id: string;
  role: string;
}

async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (decoded.role !== "admin") return null;
    return decoded;
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await verifyAdminAuth();

  // Redirect to login if not authenticated
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-900 text-white">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="w-8 h-8" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="block px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/merchants"
              className="block px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors"
            >
              Merchants
            </Link>
            <Link
              href="/admin/transactions"
              className="block px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors"
            >
              Transactions
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-8 bg-white shadow-md">
          <h1 className="text-xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{admin.email}</span>
            <Link
              href="/api/admin/logout"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-white">{children}</main>
      </div>
    </div>
  );
}
