/**
 * Central API client for all HTTP requests.
 *
 * - Uses VITE_API_BASE_URL from env; paths are relative to that base.
 * - Returns a consistent shape: { data, ok, status, error } so callers always get typed data or a structured error.
 * - Supports AbortSignal for request cancellation (e.g. when the user navigates away).
 *
 * Usage: prefer the useApi hook for GET in components; use request() directly for one-off or non-React calls.
 */

import type { ApiErrorShape, ApiRequestOptions } from "../models/models";

/** Base URL from env; strips trailing slash. Throws if VITE_API_BASE_URL is missing. */
function getBaseUrl(): string {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    throw new Error("VITE_API_BASE_URL is not defined in environment.");
  }
  return String(url).replace(/\/$/, "");
}

/** Turn a failed response body into a consistent ApiErrorShape for the rest of the app. */
function parseApiError(response: Response, body: unknown): ApiErrorShape {
  let message = response.statusText || "Request failed";
  let code: string | undefined;
  let details: unknown;

  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (typeof obj.message === "string") message = obj.message;
    if (typeof obj.error === "string") message = obj.error;
    if (typeof obj.code === "string") code = obj.code;
    if (obj.details !== undefined) details = obj.details;
  }

  return { message, status: response.status, code, details };
}

/** Result of any request: either success (data) or failure (error). */
export interface ApiResponse<T> {
  data: T | null;
  ok: boolean;
  status: number;
  error: ApiErrorShape | null;
}

/**
 * Single entry point for API calls. Use for GET, POST, PUT, PATCH, DELETE.
 * Path is appended to base URL unless it starts with "http".
 */
export async function request<T>(options: ApiRequestOptions): Promise<ApiResponse<T>> {
  const baseUrl = getBaseUrl();
  const { method = "GET", path, body, signal, headers: customHeaders } = options;

  const url = path.startsWith("http") ? path : `${baseUrl}/${path.replace(/^\//, "")}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const init: RequestInit = { method, headers, signal };
  if (body !== undefined && method !== "GET") {
    init.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return {
      data: null,
      ok: false,
      status: 0,
      error: {
        message: isAbort ? "Request cancelled" : (err instanceof Error ? err.message : "Network error"),
        code: isAbort ? "ABORTED" : "NETWORK_ERROR",
        details: err,
      },
    };
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  let parsed: unknown;
  try {
    const text = await response.text();
    parsed = text && isJson ? JSON.parse(text) : text || null;
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    return {
      data: null,
      ok: false,
      status: response.status,
      error: parseApiError(response, parsed),
    };
  }

  return {
    data: parsed as T,
    ok: true,
    status: response.status,
    error: null,
  };
}

/** Build a path from segments, e.g. buildPath("users", 1) => "users/1". */
export function buildPath(...segments: (string | number)[]): string {
  return segments
    .map((s) => String(s).trim())
    .filter(Boolean)
    .join("/")
    .replace(/\/+/g, "/");
}
