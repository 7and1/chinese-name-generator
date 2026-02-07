import { z } from "zod";

export async function readJson<TSchema extends z.ZodTypeAny>(
  request: Request,
  schema: TSchema,
): Promise<z.infer<TSchema>> {
  const text = await request.text();
  if (!text) {
    throw new ZodRequestError("EMPTY_BODY", "Request body is required");
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ZodRequestError("INVALID_JSON", "Invalid JSON body");
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ZodRequestError(
      "INVALID_REQUEST",
      "Request validation failed",
      parsed.error,
    );
  }
  return parsed.data;
}

export class ZodRequestError extends Error {
  public readonly code: string;
  public readonly zodError?: z.ZodError;

  constructor(code: string, message: string, zodError?: z.ZodError) {
    super(message);
    this.code = code;
    this.zodError = zodError;
  }
}
