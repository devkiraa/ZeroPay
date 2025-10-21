import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Get the merchant ID from the headers (added by middleware)
    const merchantId = request.headers.get('x-merchant-id');

    if (!merchantId) {
      return NextResponse.json(
        { success: false, message: 'Merchant ID not found in request' },
        { status: 401 }
      );
    }

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
    console.error('Get Latest Transactions Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
