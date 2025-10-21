import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import { z } from 'zod';

interface TokenPayload extends JwtPayload {
  id: string;
  role: string;
}

const updateSchema = z.object({
  transactionId: z.string(),
  status: z.enum(['pending', 'success', 'failed', 'refunded']),
});

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!token || !JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { transactionId, status } = updateSchema.parse(body);

    // Update the transaction
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Transaction status updated successfully',
        data: JSON.parse(JSON.stringify(transaction)),
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input', errors: error.issues.map((e) => e.message) },
        { status: 400 }
      );
    }
    console.error('Update Transaction Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
