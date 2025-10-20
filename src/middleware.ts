import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: 'Authorization header is missing' },
      { status: 401 }
    );
  }

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
      { success: false, message: 'Invalid API key format' },
      { status: 401 }
    );
  }

  // Get the base URL (e.g., http://localhost:3000)
  const validateUrl = `${request.nextUrl.origin}/api/internal/validate-key`;

  try {
    // Call our internal Node.js API to do the DB lookup
    const res = await fetch(validateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader, // Pass the original header
        'x-internal-secret': process.env.INTERNAL_API_SECRET || '',
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({ message: 'Invalid key' }));
      return NextResponse.json(
        { success: false, message: payload.message || 'Invalid API key' },
        { status: 401 }
      );
    }

    const data = await res.json(); // Expect { success: true, merchantId: '...' }

    // Attach merchant id to downstream headers for our API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-merchant-id', data.merchantId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Middleware Fetch Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error in middleware' },
      { status: 500 }
    );
  }
}

export const config = {
  // Our internal route /api/internal/ is NOT matched by this,
  // so we don't have an infinite loop.
  matcher: '/api/merchant/:path*',
};