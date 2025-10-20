import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';

interface TokenPayload extends JwtPayload {
  id: string;
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Get and verify the JWT token from the cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!token || !JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const merchantId = decoded.id;

    // Get the since parameter (timestamp)
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');

    const query: { merchantId: string; createdAt?: { $gt: Date } } = { merchantId };
    
    // If 'since' is provided, get transactions newer than that timestamp
    if (since) {
      query.createdAt = { $gt: new Date(since) };
    }

    // Fetch latest transactions (limit to 10)
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json(
      {
        success: true,
        data: JSON.parse(JSON.stringify(transactions)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Dashboard Updates Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
