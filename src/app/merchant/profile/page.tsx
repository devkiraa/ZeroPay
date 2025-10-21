import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Merchant from '@/models/Merchant';
import ProfileClient from '@/components/ProfileClient';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

interface TokenPayload extends JwtPayload {
  id: string;
}

// Server-side data fetching
async function getMerchantProfile(cookieStore: ReadonlyRequestCookies) {
  const token = cookieStore.get('token')?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    await dbConnect();

    const merchant = await Merchant.findById(decoded.id)
      .select('name email');

    if (!merchant) return null;

    return {
      merchant: JSON.parse(JSON.stringify(merchant)),
    };
  } catch (error) {
    console.error('Auth Error:', error);
    return null;
  }
}

// Main Page (Server Component)
export default async function ProfilePage() {
  const cookieStore = await cookies();
  const data = await getMerchantProfile(cookieStore);

  if (!data) {
    redirect('/merchant/login');
  }

  return <ProfileClient merchant={data.merchant} />;
}