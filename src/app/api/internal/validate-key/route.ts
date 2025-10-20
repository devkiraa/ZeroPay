import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Merchant from '@/models/Merchant';

export async function POST(request: NextRequest) {
  // 1. Check for the internal secret
  const internalSecret = request.headers.get('x-internal-secret');
  if (internalSecret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json(
      { success: false, message: 'Forbidden' },
      { status: 403 }
    );
  }

  // 2. Get the Authorization header (passed from middleware)
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: 'Missing Authorization' },
      { status: 401 }
    );
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return NextResponse.json(
      { success: false, message: 'Invalid Authorization format' },
      { status: 401 }
    );
  }
  const secretKey = parts[1];

  try {
    // 3. Connect to DB and validate the key
    await dbConnect();
    const merchant = await Merchant.findOne({ secretKey: secretKey }).lean();

    if (!merchant) {
      return NextResponse.json(
        { success: false, message: 'Invalid API key' },
        { status: 401 }
      );
    }

    // 4. Return the merchant ID on success
    return NextResponse.json(
      { success: true, merchantId: merchant._id.toString() },
      { status: 200 }
    );
  } catch (error) {
    console.error('Internal Validation Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}