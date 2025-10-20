import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Merchant from '@/models/Merchant';
import ApiKeysClient from '@/components/ApiKeysClient';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'; // Import type

interface TokenPayload extends JwtPayload {
  id: string;
}

// --- THIS IS THE FIX ---
// The helper function now *accepts* the cookieStore as an argument
async function getMerchantKeys(cookieStore: ReadonlyRequestCookies) {
  // --- END FIX ---
  const token = cookieStore.get('token')?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    await dbConnect();

    const merchant = await Merchant.findById(decoded.id)
      .select('publicKey secretKey');

    if (!merchant) return null;

    return {
      publicKey: merchant.publicKey,
      secretKey: merchant.secretKey,
    };
  } catch (error) {
    console.error('Auth Error:', error);
    return null;
  }
}

// Main Page (Server Component)
export default async function ApiKeysPage() {
  // --- THIS IS THE FIX ---
  // We call cookies() here, at the top level of the component
  const cookieStore = await cookies();
  // And then pass it to our data function
  const data = await getMerchantKeys(cookieStore);
  // --- END FIX ---

  // 1. Auth check (runs on server)
  if (!data) {
    redirect('/merchant/login');
  }

  // 2. Render the Client Component and pass the server data as props
  return (
    <ApiKeysClient
      initialPublicKey={data.publicKey}
      initialSecretKey={data.secretKey}
    />
  );
}