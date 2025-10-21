import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AuditLog from "@/models/AuditLog";
import { getSessionMerchant } from "@/lib/sessionUtils";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const merchant = await getSessionMerchant();
    if (!merchant) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sandboxMode } = await req.json();

    if (typeof sandboxMode !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid sandbox mode value" },
        { status: 400 }
      );
    }

    // Update merchant's sandbox mode
    merchant.sandboxMode = sandboxMode;
    await merchant.save();

    // Log the mode change
    await AuditLog.create({
      merchantId: merchant._id,
      action: sandboxMode ? "SANDBOX_MODE_ENABLED" : "LIVE_MODE_ENABLED",
      details: `Merchant switched to ${sandboxMode ? "sandbox" : "live"} mode`,
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: `Switched to ${
        sandboxMode ? "sandbox" : "live"
      } mode successfully`,
      sandboxMode: merchant.sandboxMode,
    });
  } catch (error) {
    console.error("Toggle sandbox mode error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to toggle sandbox mode" },
      { status: 500 }
    );
  }
}
