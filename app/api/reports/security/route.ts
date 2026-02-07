import { ok } from "@/lib/api/response";
import { withRateLimit } from "@/lib/security/rate-limit";


// CSP/Security violation report schema
const securityReportSchema = {
  "csp-report": {
    type: "object",
  },
};

async function securityReportHandler(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  // Accept both application/csp-report and application/json
  if (
    !contentType.includes("application/csp-report") &&
    !contentType.includes("application/json")
  ) {
    return ok({ success: true, logged: false });
  }

  try {
    const report = await request.json();

    // Log security violations for monitoring
    // In production, you would send this to a logging service (e.g., Sentry, DataDog)
    console.warn("[Security] CSP/Security violation:", {
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || "unknown",
      report,
      timestamp: new Date().toISOString(),
    });

    // Return 204 No Content or success to acknowledge receipt
    return ok({ success: true, logged: true });
  } catch {
    // Still return success to avoid leaking error information
    return ok({ success: true, logged: false });
  }
}

// Apply generous rate limiting for reports (100 per minute)
export const POST = withRateLimit(securityReportHandler, "report");

// Support GET for health check
export async function GET() {
  return ok({
    endpoint: "security-reports",
    status: "operational",
    accepts: ["application/csp-report", "application/json"],
  });
}
