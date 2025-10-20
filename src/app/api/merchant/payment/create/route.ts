import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import Merchant from '@/models/Merchant';
import { createPaymentSchema } from '@/lib/schemas';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // 1. Get the merchant ID from the headers (added by middleware)
    const merchantId = request.headers.get('x-merchant-id');

    // This should not happen if middleware is set up correctly, but it's a good safeguard.
    if (!merchantId) {
      return NextResponse.json(
        { success: false, message: 'Merchant ID not found in request' },
        { status: 401 }
      );
    }

    // 2. Validate the request body
    const body = await request.json();
    const { amount, method, customerEmail } = createPaymentSchema.parse(body);

    // 3. Find the merchant (to ensure they exist)
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return NextResponse.json(
        { success: false, message: 'Merchant not found' },
        { status: 404 }
      );
    }

    // 4. Create the new transaction
    // 'status' (pending) and 'orderId' are set by default in the schema
    const newTransaction = new Transaction({
      merchantId: merchant._id,
      amount,
      method,
      customerEmail,
      currency: 'INR', // Defaulting to INR as per schema
    });

    const savedTransaction = await newTransaction.save();

    // 5. Link this transaction to the merchant (optional but good practice)
    merchant.transactions.push(savedTransaction._id);
    await merchant.save();

    // 6. Return the details to the merchant's backend
    return NextResponse.json(
      {
        success: true,
        message: 'Payment order created successfully',
        data: {
          orderId: savedTransaction.orderId,
          status: savedTransaction.status,
          amount: savedTransaction.amount,
          customerEmail: savedTransaction.customerEmail,
        },
      },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid payment data',
          errors: error.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Create Payment Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}