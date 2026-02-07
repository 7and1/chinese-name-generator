/**
 * Health Check API Endpoint (Edge Runtime)
 *
 * Simplified health check for Cloudflare Pages edge runtime.
 * Returns basic application health status.
 *
 * Response Codes:
 * - 200: System is healthy
 */

import { ok } from "@/lib/api/response";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type HealthStatus = "healthy" | "degraded" | "unhealthy";

interface HealthCheckResult {
  status: HealthStatus;
  timestamp: string;
  environment: string;
  version: string;
  checks: {
    api: { status: HealthStatus };
    cache: { status: HealthStatus };
  };
}

export async function GET(request: NextRequest): Promise<Response> {
  const result: HealthCheckResult = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "0.1.0",
    checks: {
      api: { status: "healthy" },
      cache: { status: "healthy" },
    },
  };

  return ok(result, { cache: "noStore" });
}
