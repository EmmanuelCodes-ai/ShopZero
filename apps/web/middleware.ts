import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "shopzero-super-secret-production-jwt-key-change-me-in-env-2026"
);

const COOKIE_NAME = "shopzero_session";

// Protected route prefixes
const VENDOR_ROUTES = ["/vendor"];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isVendorRoute = VENDOR_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (!isVendorRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    if (isVendorRoute && role !== "VENDOR" && role !== "ADMIN") {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }

    if (isAdminRoute && role !== "ADMIN") {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/vendor/:path*", "/admin/:path*"],
};
