import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Merchant, { IMerchant } from '@/models/Merchant';
import Transaction, { ITransaction } from '@/models/Transaction';
import DashboardClient from '@/components/DashboardClient';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'; // Import type

interface TokenPayload extends JwtPayload {
  id: string;
}

// --- THIS IS THE FIX ---
// The helper function now *accepts* the cookieStore as an argument
async function getMerchantData(cookieStore: ReadonlyRequestCookies) {
  // --- END FIX ---
  const token = cookieStore.get('token')?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    await dbConnect();
    const merchant = await Merchant.findById(decoded.id)
      .select('-passwordHash')
      .lean();

    if (!merchant) return null;

    const transactions = await Transaction.find({ merchantId: merchant._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const totalRevenue = transactions
      .filter((tx) => tx.status === 'success')
      .reduce((acc, tx) => acc + tx.amount, 0);

    return {
      merchant: JSON.parse(JSON.stringify(merchant)),
      transactions: JSON.parse(JSON.stringify(transactions)),
      analytics: {
        totalRevenue: totalRevenue,
        successRate: 100, // Mock data
        refunds: 0, // Mock data
      },
    };
  } catch (error) {
    console.error('Auth Error:', error);
    return null;
  }
}

// --- Main Page (Server Component) ---
export default async function DashboardPage() {
  // --- THIS IS THE FIX ---
  // We call cookies() here, at the top level of the component
  const cookieStore = cookies();
  // And then pass it to our data function
  const data = await getMerchantData(cookieStore);
  // --- END FIX ---

  // 1. Auth check (runs on server)
  if (!data) {
    redirect('/merchant/login');
  }

  // 2. Render the Client Component and pass the server data as props
  return (
    <DashboardClient
      merchant={data.merchant}
      transactions={data.transactions}
      analytics={data.analytics}
    />
  );
}