import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import TransactionsClient from "@/components/TransactionsClient";
import { TransactionsSkeleton } from "@/components/SkeletonLoaders";
import { Suspense } from "react";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface TokenPayload extends JwtPayload {
  id: string;
}

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

// Server-side data fetching function with pagination
async function getMerchantTransactions(
  cookieStore: ReadonlyRequestCookies,
  page: number = 1
) {
  const token = cookieStore.get("token")?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    await dbConnect();

    const perPage = 20;
    const skip = (page - 1) * perPage;

    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments({
      merchantId: decoded.id,
    });
    const totalPages = Math.ceil(totalTransactions / perPage);

    // Fetch paginated transactions for this merchant, newest first
    const transactions = await Transaction.find({ merchantId: decoded.id })
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(skip);

    if (!transactions) return null;

    // Return as plain objects
    return {
      transactions: JSON.parse(JSON.stringify(transactions)),
      currentPage: page,
      totalPages,
      totalTransactions,
    };
  } catch (error) {
    console.error("Auth Error:", error);
    return null;
  }
}

// Main Page (Server Component)
export default async function TransactionsPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const data = await getMerchantTransactions(cookieStore, page);

  // 1. Auth check (runs on server)
  if (!data) {
    redirect("/merchant/login");
  }

  // 2. Render the Client Component and pass the server data as props
  return (
    <Suspense fallback={<TransactionsSkeleton />}>
      <TransactionsClient
        transactions={data.transactions}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        totalTransactions={data.totalTransactions}
      />
    </Suspense>
  );
}
