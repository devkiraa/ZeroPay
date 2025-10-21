import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Dispute from "@/models/Dispute";
import { cookies } from "next/headers";

// GET - Fetch all disputes (admin only)
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status !== "all") {
      query.status = status;
    }

    const disputes = await Dispute.find(query)
      .populate("merchantId", "name email")
      .sort({ createdAt: -1 })
      .limit(200);

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
