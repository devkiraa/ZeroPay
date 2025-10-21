import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Dispute from "@/models/Dispute";
import AuditLog from "@/models/AuditLog";
import { getSessionMerchant } from "@/lib/sessionUtils";

// POST - Merchant responds to dispute with evidence
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const merchant = await getSessionMerchant();
    if (!merchant) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const disputeId = params.id;
    const { merchantResponse, evidence } = await req.json();

    if (!merchantResponse) {
      return NextResponse.json(
        { success: false, message: "Merchant response is required" },
        { status: 400 }
      );
    }

    const dispute = await Dispute.findOne({
      _id: disputeId,
      merchantId: merchant._id,
    });

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

    // Update dispute with merchant response
    dispute.merchantResponse = merchantResponse;
    if (evidence) {
      dispute.evidence = {
        description: evidence.description || "",
        documents: evidence.documents || [],
        shippingTracking: evidence.shippingTracking || "",
        refundPolicy: evidence.refundPolicy || "",
      };
    }
    dispute.status = "under_review";
    await dispute.save();

    // Log the response
    await AuditLog.create({
      merchantId: merchant._id,
      action: "DISPUTE_RESPONSE_SUBMITTED",
      details: `Merchant responded to dispute ${disputeId} for order ${dispute.orderId}`,
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Response submitted successfully",
      data: dispute,
    });
  } catch (error) {
    console.error("Dispute response error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit response" },
      { status: 500 }
    );
  }
}
