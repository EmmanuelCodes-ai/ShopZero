import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

/**
 * GET /api/health
 * Lightweight health check endpoint that:
 * 1. Pings the Supabase DB to prevent 7-day free-tier auto-pause
 * 2. Returns app + DB status for monitoring
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Simple DB ping — counts as activity for Supabase
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "ok",
        app: "Shop Zero",
        database: "connected",
        responseTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "degraded",
        app: "Shop Zero",
        database: "unreachable",
        error: error.message,
        responseTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
