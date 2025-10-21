import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Webhook from '@/models/Webhook';
import WebhooksClient from '@/components/WebhooksClient';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

interface TokenPayload extends JwtPayload {
  id: string;
}

// Server-side data fetching
async function getMerchantWebhooks(cookieStore: ReadonlyRequestCookies) {
  const token = cookieStore.get('token')?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    await dbConnect();

    const webhooks = await Webhook.find({ merchantId: decoded.id })
      .sort({ createdAt: -1 });

    return {
      webhooks: JSON.parse(JSON.stringify(webhooks)),
    };
  } catch (error) {
    console.error('Auth Error:', error);
    return null;
  }
}

// Main Page (Server Component)
export default async function WebhooksPage() {
  const cookieStore = await cookies();
  const data = await getMerchantWebhooks(cookieStore);

  if (!data) {
    redirect('/merchant/login');
  }

  return <WebhooksClient initialWebhooks={data.webhooks} />;
}