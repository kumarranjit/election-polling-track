// src/api/client.ts
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""; // adjust to your setup

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  path: string;              
  body?: TBody;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface ApiErrorShape {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}


export async function apiRequest<TResponse = unknown, TBody = unknown>(
  options: ApiRequestOptions<TBody>
): Promise<TResponse> {
  const { method = "GET", path, body, signal, headers = {} } = options;

  const url = `${API_BASE_URL}${path}`;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Example: attach auth token here if needed
  // const token = localStorage.getItem("token");
  // if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  // Optionally handle 204 / no-content
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const err: ApiErrorShape = {
      message: json?.message ?? "Unexpected error",
      status: response.status,
      code: json?.code,
      details: json,
    };
    throw err;
  }

  return json as TResponse;
}