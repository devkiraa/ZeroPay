import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Merchant from '@/models/Merchant';
import { loginSchema } from '@/lib/schemas';
import { ZodError } from 'zod';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  // Await cookies() per Next's requirements
  const cookieStore = await cookies();

  await dbConnect();

  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, merchant.passwordHash);
    if (!isPasswordMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const tokenPayload = { id: merchant._id, email: merchant.email, name: merchant.name };
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not defined');

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    // Use object form to set cookie
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: { id: merchant._id, name: merchant.name, email: merchant.email },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input', errors: error.issues.map((e) => e.message) },
        { status: 400 }
      );
    }
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
  }
}
