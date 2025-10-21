import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Dispute from "@/models/Dispute";
import Transaction from "@/models/Transaction";
import { cookies } from "next/headers";

// POST - Admin resolves dispute
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Check admin authentication
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin-token");
    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin only" },
        { status: 401 }
      );
    }

    const disputeId = params.id;
    const { decision, notes } = await req.json();

    if (!decision || !["merchant", "customer"].includes(decision)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid decision. Must be 'merchant' or 'customer'",
        },
        { status: 400 }
      );
    }

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return NextResponse.json(
        { success: false, message: "Dispute not found" },
        { status: 404 }
      );
    }

    if (
      dispute.status === "resolved" ||
      dispute.status === "won" ||
      dispute.status === "lost"
    ) {
      return NextResponse.json(
        { success: false, message: "Dispute already resolved" },
        { status: 400 }
      );
    }

    // Update dispute resolution
    dispute.status = decision === "merchant" ? "won" : "lost";
    dispute.resolution = {
      decision,
      resolvedBy: "admin@zeropay.com", // In production, get from admin session
      resolvedAt: new Date(),
      notes: notes || "",
    };
    await dispute.save();

    // If customer wins, automatically refund the transaction
    if (decision === "customer") {
      const transaction = await Transaction.findById(dispute.transactionId);
      if (transaction && transaction.status === "success") {
        transaction.status = "refunded";
        transaction.refundedAmount = transaction.amount;
        transaction.refundReason = `Dispute resolved in favor of customer: ${dispute.reason}`;
        transaction.refundDate = new Date();
        await transaction.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: `Dispute resolved in favor of ${decision}`,
      data: dispute,
    });
  } catch (error) {
    console.error("Resolve dispute error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to resolve dispute" },
      { status: 500 }
    );
  }
}
