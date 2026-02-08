/**
 * Shared types for the API layer.
 * Used by useApi and any UI that shows loading/error/success state.
 */

import type { ApiErrorShape } from "../models/models";

/** Lifecycle of a request: idle → loading → success | error | cancelled */
export type ApiStatus = "idle" | "loading" | "success" | "error" | "cancelled";

/** Common state shape for any API-backed data: data + error + status + derived booleans */
export interface ApiState<T> {
  data: T | null;
  error: ApiErrorShape | null;
  status: ApiStatus;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
}

/** What useApi returns: ApiState plus refetch and reset */
export interface UseApiResult<T> extends ApiState<T> {
  refetch: () => Promise<void>;
  reset: () => void;
}
