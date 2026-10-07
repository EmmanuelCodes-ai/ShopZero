import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || user.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Only vendors can access KYC verification." },
        { status: 403 }
      );
    }

    // Fetch vendor by storeName (current schema — userId relation added after migration)
    const vendor = user.storeName
      ? await prisma.vendor.findFirst({ where: { name: user.storeName } })
      : null;

    return NextResponse.json({
      success: true,
      vendor: vendor
        ? {
            id: vendor.id,
            name: vendor.name,
            slug: vendor.slug,
            active: vendor.active,
            // KYC fields exist after migration; return defaults until then
            kycStatus: (vendor as any).kycStatus ?? "NOT_SUBMITTED",
            idType: (vendor as any).idType ?? null,
            idNumber: (vendor as any).idNumber ?? null,
            documentUrl: (vendor as any).documentUrl ?? null,
            businessAddress: (vendor as any).businessAddress ?? null,
            bankAccountName: (vendor as any).bankAccountName ?? null,
            bankAccountNumber: (vendor as any).bankAccountNumber ?? null,
            bankName: (vendor as any).bankName ?? null,
            rejectionReason: (vendor as any).rejectionReason ?? null,
            kycSubmittedAt: (vendor as any).kycSubmittedAt ?? null,
            kycApprovedAt: (vendor as any).kycApprovedAt ?? null,
          }
        : null,
    });
  } catch (error: any) {
    console.error("KYC fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch KYC data." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { idType, idNumber, businessAddress, bankName, bankAccountNumber, bankAccountName, documentUrl } = body;

    if (!idType || !idNumber || !businessAddress || !bankName || !bankAccountNumber || !bankAccountName) {
      return NextResponse.json(
        { error: "Please fill in all required identity and bank payout fields." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });

    if (!user || user.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Only registered vendors can submit KYC." },
        { status: 403 }
      );
    }

    // Fetch existing vendor by storeName (pre-migration lookup)
    const existingVendor = user.storeName
      ? await prisma.vendor.findFirst({ where: { name: user.storeName } })
      : null;

    // KYC fields are only available after migration — use (prisma as any) to bypass stale types
    const prismaAny = prisma as any;

    let vendor;
    if (!existingVendor) {
      const storeName = user.storeName || `${user.displayName}'s Store`;
      const baseSlug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const existing = await prisma.vendor.findFirst({ where: { slug: baseSlug } });
      const slug = existing ? `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}` : baseSlug;

      vendor = await prismaAny.vendor.create({
        data: {
          name: storeName,
          slug,
          active: false,
          kycStatus: "PENDING",
          idType,
          idNumber,
          businessAddress,
          bankName,
          bankAccountNumber,
          bankAccountName,
          documentUrl: documentUrl || null,
          kycSubmittedAt: new Date(),
        },
      });
    } else {
      vendor = await prismaAny.vendor.update({
        where: { id: existingVendor.id },
        data: {
          kycStatus: "PENDING",
          idType,
          idNumber,
          businessAddress,
          bankName,
          bankAccountNumber,
          bankAccountName,
          documentUrl: documentUrl || null,
          kycSubmittedAt: new Date(),
          rejectionReason: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "KYC verification submitted successfully. Our Trust & Risk team will review it shortly.",
      vendor: {
        id: vendor.id,
        name: vendor.name,
        kycStatus: vendor.kycStatus,
        kycSubmittedAt: vendor.kycSubmittedAt,
      },
    });
  } catch (error: any) {
    console.error("KYC submission error:", error);
    return NextResponse.json({ error: "Failed to submit KYC data." }, { status: 500 });
  }
}
