import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import Merchant from '@/models/Merchant';
import { signupSchema } from '@/lib/schemas';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // 1. Validate the request body
    const body = await request.json();
    const { name, email, password } = signupSchema.parse(body);

    // 2. Check if merchant already exists
    const existingMerchant = await Merchant.findOne({ email });
    if (existingMerchant) {
      return NextResponse.json(
        { success: false, message: 'Merchant with this email already exists' },
        { status: 400 }
      );
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create and save the new merchant
    // API keys (publicKey, secretKey) are generated automatically
    // by the default values in our Mongoose schema.
    const newMerchant = new Merchant({
      name,
      email,
      passwordHash,
    });

    const savedMerchant = await newMerchant.save();

    // Send welcome email (non-blocking)
    const { sendEmail, getWelcomeEmailContent } = await import('@/lib/sendEmail');
    const emailContent = getWelcomeEmailContent(savedMerchant.name, savedMerchant.publicKey);
    sendEmail({
      to: savedMerchant.email,
      ...emailContent,
    }).catch((error) => console.error('Failed to send welcome email:', error));

    return NextResponse.json(
      {
        success: true,
        message: 'Merchant registered successfully',
        data: {
          id: savedMerchant._id,
          name: savedMerchant.name,
          email: savedMerchant.email,
          publicKey: savedMerchant.publicKey,
          // We don't send the secretKey or passwordHash back
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
          message: 'Invalid input',
          errors: error.issues.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Signup Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}