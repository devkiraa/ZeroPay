import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Dispute from "@/models/Dispute";
import Transaction from "@/models/Transaction";
import { getSessionMerchant } from "@/lib/sessionUtils";

// GET - Fetch all disputes for merchant
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const merchant = await getSessionMerchant();
    if (!merchant) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { merchantId: merchant._id };
    if (status !== "all") {
      query.status = status;
    }

    const disputes = await Dispute.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      data: disputes,
    });
  } catch (error) {
    console.error("Fetch disputes error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}

// POST - Create a new dispute (simulate customer creating dispute)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const merchant = await getSessionMerchant();
    if (!merchant) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { transactionId, reason, customerMessage } = await req.json();

    if (!transactionId || !reason || !customerMessage) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if transaction already has a dispute
    if (transaction.hasDispute) {
      return NextResponse.json(
        { success: false, message: "Transaction already has a dispute" },
        { status: 400 }
      );
    }

    // Create dispute
    const dispute = await Dispute.create({
      transactionId: transaction._id,
      merchantId: transaction.merchantId,
      orderId: transaction.orderId,
      amount: transaction.amount,
      reason,
      customerEmail: transaction.customerEmail,
      customerMessage,
      status: "open",
    });

    // Mark transaction as having dispute
    transaction.hasDispute = true;
    await transaction.save();

    // Send dispute notification email to merchant
    const { sendEmail, getDisputeCreatedEmailContent } = await import(
      "@/lib/sendEmail"
    );
    const merchantInfo = await import("@/models/Merchant").then((mod) =>
      mod.default.findById(transaction.merchantId)
    );
    if (merchantInfo) {
      const emailContent = getDisputeCreatedEmailContent(
        merchantInfo.name,
        transaction.orderId,
        transaction.amount,
        reason,
        customerMessage
      );
      sendEmail({
        to: merchantInfo.email,
        ...emailContent,
      }).catch((error) =>
        console.error("Failed to send dispute notification email:", error)
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dispute created successfully",
      data: dispute,
    });
  } catch (error) {
    console.error("Create dispute error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create dispute" },
      { status: 500 }
    );
  }
}
