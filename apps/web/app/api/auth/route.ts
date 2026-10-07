import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import {
  hashPassword,
  verifyPassword,
  signToken,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  isValidEmail,
  isValidPassword,
  slugify,
} from "../../../lib/auth";

/**
 * GET /api/auth -> Check current authenticated session
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        displayName: true,
        storeName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      await clearSessionCookie();
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    // Fetch vendor record if vendor
    let vendorSlug: string | undefined = undefined;
    if (user.role === "VENDOR" && user.storeName) {
      const vendor = await prisma.vendor.findFirst({
        where: { name: user.storeName },
      });
      vendorSlug = vendor?.slug;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.displayName || user.email?.split("@")[0] || "User",
        role: user.role,
        storeName: user.storeName,
        storeSlug: vendorSlug,
      },
    });
  } catch (error: any) {
    console.error("Session check error:", error);
    return NextResponse.json({ authenticated: false, user: null, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/auth -> Register, Login, Logout
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, phone, displayName, role, storeName } = body;

    // --- LOGOUT ---
    if (action === "logout") {
      await clearSessionCookie();
      return NextResponse.json({ success: true, message: "Logged out successfully" });
    }

    // --- REGISTER ---
    if (action === "register") {
      if (!email || !isValidEmail(email)) {
        return NextResponse.json({ success: false, error: "A valid email address is required." }, { status: 400 });
      }

      if (!password) {
        return NextResponse.json({ success: false, error: "Password is required." }, { status: 400 });
      }

      const passCheck = isValidPassword(password);
      if (!passCheck.valid) {
        return NextResponse.json({ success: false, error: passCheck.message }, { status: 400 });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const isVendor = role === "VENDOR" || role === "seller";

      if (isVendor && (!storeName || !storeName.trim())) {
        return NextResponse.json(
          { success: false, error: "Store name is required for vendor registration." },
          { status: 400 }
        );
      }

      // Check existing user
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: normalizedEmail }, ...(phone ? [{ phone }] : [])],
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "An account with this email or phone number already exists." },
          { status: 400 }
        );
      }

      // Secure password hash
      const passwordHash = await hashPassword(password);
      const computedRole = isVendor ? "VENDOR" : "CUSTOMER";
      const cleanStoreName = isVendor ? storeName.trim() : null;
      let generatedSlug = isVendor && cleanStoreName ? slugify(cleanStoreName) : null;

      // Handle duplicate vendor slug
      if (generatedSlug) {
        const existingVendor = await prisma.vendor.findUnique({ where: { slug: generatedSlug } });
        if (existingVendor) {
          generatedSlug = `${generatedSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
      }

      // Atomic transaction: create User & Vendor
      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email: normalizedEmail,
            phone: phone ? phone.trim() : null,
            passwordHash,
            displayName: displayName?.trim() || (isVendor ? cleanStoreName : normalizedEmail.split("@")[0]),
            storeName: cleanStoreName,
            role: computedRole,
          },
        });

        let newVendor = null;
        if (isVendor && cleanStoreName && generatedSlug) {
          newVendor = await tx.vendor.create({
            data: {
              name: cleanStoreName,
              slug: generatedSlug,
            },
          });
        }

        return { newUser, newVendor };
      });

      // Sign JWT & set secure HttpOnly cookie
      const token = await signToken({
        userId: result.newUser.id,
        email: result.newUser.email!,
        role: result.newUser.role,
        vendorId: result.newVendor?.id,
        storeSlug: result.newVendor?.slug,
      });

      await setSessionCookie(token);

      return NextResponse.json({
        success: true,
        user: {
          id: result.newUser.id,
          name: result.newUser.displayName,
          email: result.newUser.email,
          phone: result.newUser.phone,
          role: result.newUser.role,
          storeName: result.newUser.storeName,
          storeSlug: result.newVendor?.slug,
        },
      });
    }

    // --- LOGIN ---
    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
      }

      const normalizedEmail = email.toLowerCase().trim();

      const user = await prisma.user.findFirst({
        where: { email: normalizedEmail },
      });

      // Security best practice: Constant-time comparison & generic error message
      if (!user || !user.passwordHash) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 }
        );
      }

      const isPasswordValid = await verifyPassword(password, user.passwordHash);

      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 }
        );
      }

      // Fetch vendor slug if vendor
      let vendorId: string | undefined = undefined;
      let vendorSlug: string | undefined = undefined;
      if (user.role === "VENDOR" && user.storeName) {
        const vendor = await prisma.vendor.findFirst({
          where: { name: user.storeName },
        });
        vendorId = vendor?.id;
        vendorSlug = vendor?.slug;
      }

      // Sign JWT & set HttpOnly cookie
      const token = await signToken({
        userId: user.id,
        email: user.email!,
        role: user.role,
        vendorId,
        storeSlug: vendorSlug,
      });

      await setSessionCookie(token);

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          phone: user.phone,
          role: user.role,
          storeName: user.storeName,
          storeSlug: vendorSlug,
        },
      });
    }

    return NextResponse.json({ success: false, error: "Invalid authentication action." }, { status: 400 });
  } catch (error: any) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
