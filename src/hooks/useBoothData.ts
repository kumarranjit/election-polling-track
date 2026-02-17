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
import { useAuth } from "../context/AuthContext";

/** Hook to fetch booth-agent data for the currently logged-in mobile number. */
export function useBoothData(options?: { enabled?: boolean }) {
  const { mobileNumber } = useAuth();

  const path = `/byMobile2?mobile=${mobileNumber ?? ""}`;

  return useApi<BoothAgentInfoRes>({
    path,
    enabled: (options?.enabled ?? true) && !!mobileNumber,
    refetchOnWindowFocus: false,
  });
}
