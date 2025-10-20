import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';
import { cookies } from 'next/headers';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  await dbConnect();

  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    const tokenPayload = { id: admin._id, email: admin.email, role: 'admin' };
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not defined');

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    // Use a different cookie name for admin to avoid conflicts
    cookieStore.set({
      name: 'admin-token',
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
        data: { id: admin._id, email: admin.email },
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
    console.error('Admin Login Error:', error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
  }
}
