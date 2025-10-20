import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Webhook from '@/models/Webhook';
import { z } from 'zod';

// Zod schema for validation
const webhookSchema = z.object({
  url: z.string().url({ message: 'Invalid URL format' }),
  events: z.array(z.enum(['payment.success', 'payment.failed'])),
});

// --- GET: Fetch all existing webhooks for the merchant ---
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const merchantId = request.headers.get('x-merchant-id'); // Set by middleware
    if (!merchantId) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const webhooks = await Webhook.find({ merchantId: merchantId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, data: webhooks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// --- POST: Create a new webhook ---
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const merchantId = request.headers.get('x-merchant-id'); // Set by middleware
    if (!merchantId) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Validate body
    const body = await request.json();
    const { url, events } = webhookSchema.parse(body);

    const newWebhook = new Webhook({
      merchantId,
      url,
      events,
    });

    await newWebhook.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Webhook created successfully',
        data: newWebhook,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input',
          errors: error.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}