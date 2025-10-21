import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Webhook from "@/models/Webhook";
import { getSessionMerchant } from "../../../../../lib/sessionUtils";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const merchant = await getSessionMerchant();
  if (!merchant)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  const { id } = params;
  const hook = await Webhook.findOne({ _id: id, merchant: merchant._id });
  if (!hook)
    return NextResponse.json(
      { success: false, message: "Webhook not found" },
      { status: 404 }
    );
  await hook.deleteOne();
  return NextResponse.json({ success: true });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const merchant = await getSessionMerchant();
  if (!merchant)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  const { id } = params;
  const hook = await Webhook.findOne({ _id: id, merchant: merchant._id });
  if (!hook)
    return NextResponse.json(
      { success: false, message: "Webhook not found" },
      { status: 404 }
    );
  // Simulate sending a test event
  // In real gateways, this would POST a sample payload to the webhook URL
  // Here, we just return success
  return NextResponse.json({
    success: true,
    message: "Test event sent (mock)",
  });
}
