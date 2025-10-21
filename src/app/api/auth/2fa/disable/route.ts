import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Merchant from "@/models/Merchant";
import AuditLog from "@/models/AuditLog";
import * as speakeasy from "speakeasy";

interface TokenPayload {
  id: string;
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!token || !JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const merchant = await Merchant.findById(decoded.id);

    if (!merchant) {
      return NextResponse.json(
        { success: false, message: "Merchant not found" },
        { status: 404 }
      );
    }

    const { code } = await req.json();

    if (!code || !merchant.twoFactorSecret || !merchant.twoFactorEnabled) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    // Verify the token before disabling
    const verified = speakeasy.totp.verify({
      secret: merchant.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 2,
    });

    if (!verified) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Disable 2FA
    merchant.twoFactorEnabled = false;
    merchant.twoFactorSecret = undefined;
    await merchant.save();

    // Log the action
    await AuditLog.create({
      merchantId: merchant._id,
      action: "2FA_DISABLED",
      details: "Two-factor authentication was disabled",
      ipAddress:
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "2FA disabled successfully",
    });
  } catch (error) {
    console.error("2FA Disable Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to disable 2FA" },
      { status: 500 }
    );
  }
}
