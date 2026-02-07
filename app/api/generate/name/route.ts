import { generateNames } from "@/lib/engines/generator";
import type { NameGenerationOptions } from "@/lib/types";
import { readJson, ZodRequestError } from "@/lib/api/parse";
import { ok, fail } from "@/lib/api/response";
import { generateNameRequestSchema } from "@/lib/api/schemas";
import { parseBirthDateYmd } from "@/lib/api/birthdate";
import { unique } from "@/lib/utils";
import { withRateLimit } from "@/lib/security/rate-limit";


async function generateNameHandler(request: Request) {
  const startTime = performance.now();

  try {
    const body = await readJson(request, generateNameRequestSchema);

    const birthDate = body.birthDate
      ? parseBirthDateYmd(body.birthDate)
      : undefined;
    const preferredElements = body.preferredElements
      ? unique(body.preferredElements)
      : undefined;
    const avoidElementsRaw = body.avoidElements
      ? unique(body.avoidElements)
      : undefined;
    const avoidElements =
      preferredElements && avoidElementsRaw
        ? avoidElementsRaw.filter((e) => !preferredElements.includes(e))
        : avoidElementsRaw;

    // Parse options
    const options: NameGenerationOptions = {
      surname: body.surname.trim(),
      gender: body.gender,
      birthDate: birthDate
        ? new Date(Date.UTC(birthDate.year, birthDate.month - 1, birthDate.day))
        : undefined,
      birthHour: body.birthHour,
      preferredElements,
      avoidElements,
      style: body.style ?? "classic",
      source: body.source ?? "any",
      characterCount: body.characterCount ?? 2,
      maxResults: body.maxResults ?? 20,
    };

    // Generate names
    const names = await generateNames(options);

    const duration = performance.now() - startTime;

    // Return response with timing header
    const response = ok(names);
    response.headers.set("X-Response-Time", `${duration.toFixed(2)}ms`);
    response.headers.set("X-Request-Id", crypto.randomUUID());

    return response;
  } catch (error) {
    const duration = performance.now() - startTime;

    if (error instanceof ZodRequestError) {
      const response = fail(
        400,
        error.code,
        error.message,
        error.zodError ? { issues: error.zodError.issues } : undefined,
      );
      response.headers.set("X-Response-Time", `${duration.toFixed(2)}ms`);
      return response;
    }

    console.error("Error generating names:", error);
    const response = fail(500, "GENERATION_ERROR", "Failed to generate names");
    response.headers.set("X-Response-Time", `${duration.toFixed(2)}ms`);
    return response;
  }
}

// Apply rate limiting: 10 requests per minute per IP
export const POST = withRateLimit(generateNameHandler, "generate");
