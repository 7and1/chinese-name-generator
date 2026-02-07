/**
 * Test Server Helper
 *
 * Provides a test server for integration testing of API routes.
 * This uses Next.js's built-in test utilities or creates a minimal server.
 */

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import type { RequestListener } from "http";

let testServer: ReturnType<typeof createServer> | null = null;
let nextApp: ReturnType<typeof next> | null = null;

export const TEST_SERVER_URL =
  process.env.TEST_SERVER_URL || "http://localhost:45123";

/**
 * Setup test server for API route testing
 */
export async function setupTestServer(): Promise<string> {
  // If a server URL is provided via environment, use that
  if (process.env.TEST_SERVER_URL) {
    return process.env.TEST_SERVER_URL;
  }

  // For local testing, we need to start a Next.js server
  // This is typically handled by the test runner
  // For now, return a mock URL
  return TEST_SERVER_URL;
}

/**
 * Teardown test server
 */
export async function teardownTestServer(): Promise<void> {
  if (testServer) {
    await new Promise<void>((resolve) => {
      testServer?.close(() => resolve());
    });
    testServer = null;
  }

  if (nextApp) {
    await nextApp.close();
    nextApp = null;
  }
}

/**
 * Make a test request to an API route
 */
export async function testApiRequest(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  const url = `${TEST_SERVER_URL}${path}`;
  return fetch(url, options);
}

/**
 * Helper to create a mock request
 */
export function createMockRequest(
  body: unknown,
  headers?: Record<string, string>,
): Request {
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}
