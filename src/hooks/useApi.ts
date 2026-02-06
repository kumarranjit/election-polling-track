// src/hooks/useApi.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiErrorShape } from '../models/models';

export interface UseApiOptions<TResponse, TBody = unknown> {
  /** Function that calls apiRequest with correct path/method/body */
  requestFn: (signal: AbortSignal, body?: TBody) => Promise<TResponse>;
  /** Auto run once on mount */
  auto?: boolean;
  /** Optional initial data */
  initialData?: TResponse | null;
  /** Called when request succeeds */
  onSuccess?: (data: TResponse) => void;
  /** Called when request fails */
  onError?: (error: ApiErrorShape | Error) => void;
}

export interface UseApiState<TResponse> {
  data: TResponse | null;
  loading: boolean;
  error: ApiErrorShape | Error | null;
  status: "idle" | "loading" | "success" | "error" | "cancelled";
}

export interface UseApiReturn<TResponse, TBody = unknown>
  extends UseApiState<TResponse> {
  /** Trigger request; if body is needed, pass here */
  run: (body?: TBody) => Promise<void>;
  /** Cancel in-flight request (if any) */
  cancel: () => void;
  /** Alias for run, more semantic when used for reload buttons */
  refetch: () => Promise<void>;
}

export function useApi<TResponse, TBody = unknown>(
  options: UseApiOptions<TResponse, TBody>
): UseApiReturn<TResponse, TBody> {
  const { requestFn, auto = true, initialData = null, onSuccess, onError } =
    options;

  const [state, setState] = useState<UseApiState<TResponse>>({
    data: initialData,
    loading: auto, // if auto, we consider loading initially
    error: null,
    status: auto ? "loading" : "idle",
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setState((prev) => ({
      ...prev,
      loading: false,
      status: "cancelled",
    }));
  }, []);

  const run = useCallback(
    async (body?: TBody) => {
      // Cancel any previous request
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const { signal } = controller;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        status: "loading",
      }));

      try {
        const data = await requestFn(signal, body);

        if (!isMountedRef.current || signal.aborted) return;

        setState({
          data,
          loading: false,
          error: null,
          status: "success",
        });

        onSuccess?.(data);
      } catch (err: any) {
        if (signal.aborted || !isMountedRef.current) {
          // Treat as cancellation, do not call onError
          return;
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: err,
          status: "error",
        }));

        onError?.(err);
      }
    },
    [requestFn, onSuccess, onError]
  );

  const refetch = useCallback(async () => {
    await run();
  }, [run]);

  // Run on mount if auto
  useEffect(() => {
    if (auto) {
      run().catch(() => {
        // errors already handled in run
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  return {
    ...state,
    run,
    cancel,
    refetch,
  };
}