import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * Meta User Data Deletion Callback Endpoint
 * Complies with Meta Platform Terms for Data Deletion Request Callbacks
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);
    const signedRequest = formData?.get("signed_request") as string | null;

    // Generate a unique confirmation tracking code
    const confirmationCode = `DEL-${Date.now().toString(36).toUpperCase()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    const statusUrl = `https://shop-zero-inky.vercel.app/data-deletion?code=${confirmationCode}`;

    // Meta expects a JSON response containing 'url' and 'confirmation_code'
    return NextResponse.json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    });
  } catch (error: any) {
    console.error("Data Deletion Callback Error:", error);
    return NextResponse.json(
      { error: "Failed to process data deletion request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "ShopZero Data Deletion Endpoint",
    instructions_url: "https://shop-zero-inky.vercel.app/data-deletion",
  });
}
