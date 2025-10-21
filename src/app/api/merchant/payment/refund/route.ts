import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { orderId, amount, reason } = await request.json();
    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing orderId or amount" },
        { status: 400 }
      );
    }
    const tx = await Transaction.findOne({ orderId });
    if (!tx) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }
    if (tx.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          message: "Only successful transactions can be refunded",
        },
        { status: 400 }
      );
    }
    if (amount > tx.amount) {
      return NextResponse.json(
        { success: false, message: "Refund amount exceeds transaction amount" },
        { status: 400 }
      );
    }
    tx.status = "refunded";
    tx.refundedAmount = amount;
    tx.refundReason = reason || "";
    tx.refundDate = new Date();
    await tx.save();

    // Send refund notification email
    const { sendEmail, getRefundEmailContent } = await import(
      "@/lib/sendEmail"
    );
    const emailContent = getRefundEmailContent(
      tx.orderId,
      amount,
      tx.currency,
      reason || "Refund requested by merchant",
      tx.customerEmail
    );
    sendEmail({
      to: tx.customerEmail,
      ...emailContent,
    }).catch((error) => console.error("Failed to send refund email:", error));

    return NextResponse.json({
      success: true,
      message: "Refund processed",
      data: { orderId, refundedAmount: amount, refundReason: reason },
    });
  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.json({
      success: false,
      message: "Refund failed",
    });
  }
}
