import { ok, fail } from "@/lib/api/response";
import { withRateLimit } from "@/lib/security/rate-limit";
import { searchKindSchema, searchLimitSchema } from "@/lib/api/schemas";
import { searchContent } from "@/lib/search";


async function searchHandler(request: Request) {
  const startTime = performance.now();

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const kind = (url.searchParams.get("kind") ?? "all").trim();
  const limitParam = Number(url.searchParams.get("limit") ?? "20");

  // Validate search kind
  const kindValidation = searchKindSchema.safeParse(kind);
  if (!kindValidation.success) {
    return fail(
      400,
      "INVALID_KIND",
      "kind must be one of: all, character, poetry, idiom",
    );
  }
  const validatedKind = kindValidation.data;

  // Validate and sanitize limit
  const limitValidation = searchLimitSchema.safeParse(limitParam);
  const limit = limitValidation.success
    ? Math.min(limitValidation.data, 100)
    : 20;

  const response = ok(searchContent({ query: q, kind: validatedKind, limit }), {
    cache: "short",
  });
  response.headers.set(
    "X-Response-Time",
    `${(performance.now() - startTime).toFixed(2)}ms`,
  );
  return response;
}

// Apply rate limiting: 30 requests per minute per IP
export const GET = withRateLimit(searchHandler, "search");
