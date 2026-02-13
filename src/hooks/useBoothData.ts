/**
 * Booth agent data hook — uses the shared useApi with the booth-agent endpoint.
 *
 * Returns the same shape as useApi<BoothAgentInfoRes>: data (API response), isLoading, isError, error, refetch, etc.
 * The page uses .data as bootAgentInfoRes and handles loading/error in the UI.
 *
 * To point at a different endpoint, change BOOTH_AGENT_PATH below (and ensure it matches your backend).
 */

import { useApi } from "./useApi";
import type { BoothAgentInfoRes } from "../models/models";

/** Path appended to VITE_API_BASE_URL. Example: "/byMobile2?mobile=9629019295" or "booth-agent" */
const BOOTH_AGENT_PATH = "/byMobile2?mobile=9629019295";

export function useBoothData(options?: { enabled?: boolean }) {
  return useApi<BoothAgentInfoRes>({
    path: BOOTH_AGENT_PATH,
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
  });
}
