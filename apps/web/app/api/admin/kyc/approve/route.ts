import { NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Admin role (or session role)
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const { vendorId, action, rejectionReason } = body;

    if (!vendorId || !action) {
      return NextResponse.json({ error: "Vendor ID and action are required." }, { status: 400 });
    }

    // Use (prisma as any) to bypass stale generated types until migration runs
    const prismaAny = prisma as any;

    if (action === "approve") {
      const updated = await prismaAny.vendor.update({
        where: { id: vendorId },
        data: {
          kycStatus: "APPROVED",
          active: true,
          kycApprovedAt: new Date(),
          rejectionReason: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Vendor ${updated.name} has been approved and activated!`,
        vendor: updated,
      });
    }

    if (action === "reject") {
      const updated = await prismaAny.vendor.update({
        where: { id: vendorId },
        data: {
          kycStatus: "REJECTED",
          active: false,
          rejectionReason: rejectionReason || "Provided details do not match legal registry.",
        },
      });

      return NextResponse.json({
        success: true,
        message: `Vendor ${updated.name} KYC was rejected.`,
        vendor: updated,
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Admin KYC approval error:", error);
    return NextResponse.json({ error: "Failed to process KYC decision." }, { status: 500 });
  }
}
