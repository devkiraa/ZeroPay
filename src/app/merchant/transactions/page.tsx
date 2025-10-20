import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Transaction, { ITransaction } from '@/models/Transaction';
import TransactionsClient from '@/components/TransactionsClient';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

interface TokenPayload extends JwtPayload {
  id: string;
}

// Server-side data fetching function
async function getMerchantTransactions(cookieStore: ReadonlyRequestCookies) {
  const token = cookieStore.get('token')?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    await dbConnect();

    // Fetch all transactions for this merchant, newest first
    // --- THIS IS THE CORRECTED BLOCK ---
    const transactions = await Transaction.find({ merchantId: decoded.id })
      .sort({ createdAt: -1 })
      .lean(); // Use .lean()
    // --- END CORRECTION --- (Removed duplicated code)

    if (!transactions) return null;

    // Return as plain objects
    return {
      transactions: JSON.parse(JSON.stringify(transactions)),
    };
  } catch (error) {
    console.error('Auth Error:', error);
    return null;
  }
}

// Main Page (Server Component)
export default async function TransactionsPage() {
  const cookieStore = cookies();
  const data = await getMerchantTransactions(cookieStore);

  // 1. Auth check (runs on server)
  if (!data) {
    redirect('/merchant/login');
  }

  // 2. Render the Client Component and pass the server data as props
  return <TransactionsClient transactions={data.transactions} />;
}