import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Merchant from '@/models/Merchant';
import { v4 as uuidv4 } from 'uuid';

interface TokenPayload extends JwtPayload {
  id: string;
}

export async function POST() {
  await dbConnect();

  try {
    // 1. Get and verify the JWT token from the cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!token || !JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const merchantId = decoded.id;

    // 2. Generate new keys
    const newPublicKey = `pk_test_${uuidv4().replace(/-/g, '')}`;
    const newSecretKey = `sk_test_${uuidv4().replace(/-/g, '')}`;

    // 3. Find merchant and update their keys
    const updatedMerchant = await Merchant.findByIdAndUpdate(
      merchantId,
      {
        publicKey: newPublicKey,
        secretKey: newSecretKey,
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedMerchant) {
      return NextResponse.json(
        { success: false, message: 'Merchant not found' },
        { status: 404 }
      );
    }

    // 4. Return the new keys
    return NextResponse.json(
      {
        success: true,
        message: 'API keys regenerated successfully',
        publicKey: updatedMerchant.publicKey,
        secretKey: updatedMerchant.secretKey,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Regenerate Keys Error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}