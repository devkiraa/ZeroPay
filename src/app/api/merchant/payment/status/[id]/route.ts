import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';

// The 'params' object is automatically passed to the function
// when using dynamic route segments.
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    // 1. Get the orderId from the URL
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // 2. Find the transaction by its 'orderId'
    // We select only the fields the customer should see
    const transaction = await Transaction.findOne({ orderId: orderId }).select(
      'orderId status amount currency method'
    );

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Payment not found' },
        { status: 404 }
      );
    }

    // 3. Return the transaction status
    return NextResponse.json(
      {
        success: true,
        data: transaction,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get Payment Status Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}