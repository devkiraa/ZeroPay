import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import Webhook from '@/models/Webhook'; // Import the new Webhook model
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
    const isSuccess = Math.random() > 0.2; // 80% success rate
    const newStatus = isSuccess ? 'success' : 'failed';
    transaction.status = newStatus;

    // 5. Save the updated transaction
    await transaction.save();

    // 6. --- WEBHOOK SIMULATION ---
    // This runs after the payment is confirmed but before
    // we return a response, so the user's checkout is fast.
    const eventType =
      newStatus === 'success' ? 'payment.success' : 'payment.failed';

    // Find all webhooks for this merchant subscribed to this event
    const webhooks = await Webhook.find({
      merchantId: transaction.merchantId,
      events: eventType,
    });

    // Create the payload
    const payload = {
      event: eventType,
      data: {
        orderId: transaction.orderId,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        method: transaction.method,
        customerEmail: transaction.customerEmail,
        createdAt: transaction.createdAt,
      },
    };

    // "Fire-and-forget" all webhooks. We don't await this
    // so we can return the API response to the user immediately.
    webhooks.forEach((hook) => {
      console.log(`Sending webhook for ${eventType} to ${hook.url}`);
      fetch(hook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In a real app, you'd generate an HMAC signature
          // using hook.secret and the payload body
          'X-ZeroPay-Signature': 'mock_signature_here',
        },
        body: JSON.stringify(payload),
      }).catch((err) => {
        // Log errors, but don't block the main flow
        console.error(`Failed to send webhook to ${hook.url}:`, err.message);
      });
    });

    // 7. Return the final status to the checkout page
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