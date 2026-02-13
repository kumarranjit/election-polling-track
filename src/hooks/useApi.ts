/**
 * Centralized GET hook for any API endpoint.
 *
 * - Handles loading, error, and success state.
 * - Supports request cancellation when path changes or component unmounts.
 * - Optional: skip first request (enabled: false) or refetch on window focus.
 *
 * Use this for read-only data. For POST/PUT/DELETE, use the API client's request() or a dedicated mutation hook.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { request } from "../api/client";
import type { ApiErrorShape } from "../models/models";
import type { ApiStatus, UseApiResult } from "../api/types";

function initialState<T>(): {
  data: T | null;
  error: ApiErrorShape | null;
  status: ApiStatus;
} {
  return { data: null, error: null, status: "idle" };
}

export interface UseApiParams {
  /** Path relative to VITE_API_BASE_URL (e.g. "booth-agent" or "users/1"). */
  path: string;
  /** When false, no request is sent until it becomes true. Useful when waiting for a required param. */
  enabled?: boolean;
  /** When true, refetch when the window regains focus. */
  refetchOnWindowFocus?: boolean;
}

/**
 * Fetches GET path on mount (and when path/enabled change). Returns data, loading, error, refetch, reset.
 */
export function useApi<T>(params: UseApiParams): UseApiResult<T> {
  const { path, enabled = true, refetchOnWindowFocus = false } = params;
  const [state, setState] = useState(initialState<T>());
  const abortRef = useRef<AbortController | null>(null);
  const pathRef = useRef(path);

  const fetchData = useCallback(async () => {
    if (!path?.trim()) {
      setState(initialState<T>());
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setState((s) => ({ ...s, status: "loading", error: null }));

    const result = await request<T>({
      method: "GET",
      path,
      signal: abortRef.current.signal,
    });

    if (abortRef.current?.signal.aborted) {
      setState((s) => ({ ...s, status: "cancelled" }));
      return;
    }

    if (result.ok) {
      setState({ data: result.data, error: null, status: "success" });
    } else {
      setState({
        data: null,
        error: result.error ?? { message: "Unknown error" },
        status: "error",
      });
    }
  }, [path]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(initialState<T>());
  }, []);

  // Keep pathRef in sync for refetch-on-focus
  useEffect(() => {
    pathRef.current = path;
  }, [path]);

  // Initial fetch and cleanup on path change / unmount
  useEffect(() => {
    if (!enabled) return;
    fetchData();
    return () => abortRef.current?.abort();
  }, [enabled, path, fetchData]);

  // Optional: refetch when user returns to the tab
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;
    const onFocus = () => {
      if (pathRef.current) refetch();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetchOnWindowFocus, enabled, refetch]);

  const { status } = state;
  return {
    ...state,
    status,
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
    isIdle: status === "idle",
    refetch,
    reset,
  };
}
