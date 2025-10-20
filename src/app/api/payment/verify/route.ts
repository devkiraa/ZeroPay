import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import { z } from 'zod';

// Zod schema for validation
const verifySchema = z.object({
  orderId: z.string().startsWith('order_'),
});

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // 1. Validate the request body
    const body = await request.json();
    const { orderId } = verifySchema.parse(body);

    // 2. Find the transaction
    const transaction = await Transaction.findOne({ orderId: orderId });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    // 3. Check if it's already processed
    if (transaction.status !== 'pending') {
      return NextResponse.json(
        {
          success: false,
          message: 'This payment has already been processed.',
        },
        { status: 400 }
      );
    }

    // 4. --- MOCK PAYMENT SIMULATION ---
    // In a real app, you'd verify a signature or use a webhook.
    // Here, we'll just simulate a success (80% chance) or failure.
    const isSuccess = Math.random() > 0.2; // 80% success rate

    if (isSuccess) {
      transaction.status = 'success';
    } else {
      transaction.status = 'failed';
    }

    // 5. Save the updated transaction
    await transaction.save();

    // 6. Send payment success email (non-blocking, only if successful)
    if (isSuccess) {
      const { sendEmail, getPaymentSuccessEmailContent } = await import('@/lib/sendEmail');
      const emailContent = getPaymentSuccessEmailContent(
        transaction.orderId,
        transaction.amount,
        transaction.currency,
        transaction.customerEmail
      );
      sendEmail({
        to: transaction.customerEmail,
        ...emailContent,
      }).catch((error) => console.error('Failed to send payment success email:', error));
    }

    return NextResponse.json(
      {
        success: true,
        status: transaction.status,
        orderId: transaction.orderId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify Payment Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid data', errors: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}