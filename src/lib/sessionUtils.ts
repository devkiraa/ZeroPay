import { cookies } from "next/headers";
import Merchant from "@/models/Merchant";
import dbConnect from "./dbConnect";

export async function getSessionMerchant() {
  await dbConnect();
  const cookieStore = cookies();
  const merchantId = cookieStore.get("merchantId")?.value;
  if (!merchantId) return null;
  return await Merchant.findById(merchantId);
}
