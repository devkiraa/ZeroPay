import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Merchant from '@/models/Merchant';

export async function middleware(request: NextRequest) {
  // 1. Get the Authorization header
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: 'Authorization header is missing' },
      { status: 401 }
    );
  }

  // 2. Check for 'Bearer' prefix and extract the key
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return NextResponse.json(
      { success: false, message: 'Invalid Authorization header format' },
      { status: 401 }
    );
  }
  
  const secretKey = parts[1];

  if (!secretKey.startsWith('sk_test_')) {
    return NextResponse.json(
      { success: false, message: 'Invalid API key' },
      { status: 401 }
    );
  }

  try {
    // 3. Connect to DB and find the merchant by their secret key
    await dbConnect();
    const merchant = await Merchant.findOne({ secretKey: secretKey });

    if (!merchant) {
      return NextResponse.json(
        { success: false, message: 'Invalid API key' },
        { status: 401 }
      );
    }

    // 4. Key is valid! Attach merchant ID to the request headers.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-merchant-id', merchant._id.toString());

    // Continue to the intended API route
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.error('Middleware Error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

// 5. The Matcher: This still protects all /api/merchant/ routes
export const config = {
  matcher: '/api/merchant/:path*',
};