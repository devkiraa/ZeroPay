import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Merchant from '@/models/Merchant';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

interface TokenPayload extends JwtPayload {
  id: string;
}

// Validation schemas
const updateNameSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // 1. Get and verify the JWT token from the cookie
    const token = cookies().get('token')?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!token || !JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const merchantId = decoded.id;

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return NextResponse.json(
        { success: false, message: 'Merchant not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // 2. Check if this is a name update or password update
    if (body.name) {
      // --- Handle Name Update ---
      const { name } = updateNameSchema.parse(body);
      merchant.name = name;
      await merchant.save();
      return NextResponse.json(
        { success: true, message: 'Name updated successfully' },
        { status: 200 }
      );
    } else if (body.currentPassword && body.newPassword) {
      // --- Handle Password Update ---
      const { currentPassword, newPassword } = updatePasswordSchema.parse(body);

      // Check if current password is correct
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        merchant.passwordHash
      );
      if (!isPasswordMatch) {
        return NextResponse.json(
          { success: false, message: 'Incorrect current password' },
          { status: 400 }
        );
      }

      // Hash and save new password
      const salt = await bcrypt.genSalt(10);
      merchant.passwordHash = await bcrypt.hash(newPassword, salt);
      await merchant.save();

      return NextResponse.json(
        { success: true, message: 'Password updated successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input',
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    console.error('Profile Update Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}