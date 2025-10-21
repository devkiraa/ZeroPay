import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Merchant from "@/models/Merchant";
import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";

interface TokenPayload {
  id: string;
}

export async function POST() {
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

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: `ZeroPay (${merchant.email})`,
      issuer: "ZeroPay",
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || "");

    // Store the secret temporarily (not enabled until verified)
    merchant.twoFactorSecret = secret.base32;
    await merchant.save();

    return NextResponse.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
      },
    });
  } catch (error) {
    console.error("2FA Setup Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to setup 2FA" },
      { status: 500 }
    );
  }
}
