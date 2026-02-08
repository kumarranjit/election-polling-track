// src/hooks/useBoothData.ts
import { useApi } from "./useApi";
import { apiRequest } from "../api/client";

export interface Booth {
  id: string;
  name: string;
  // add other fields
}

export function useBoothData() {
  const api = useApi({
    auto: true,
    requestFn: (signal) =>
      apiRequest<Booth[]>({
        method: "GET",
        path: "/api/election/byMobile?mobile=9629019295",
        signal,
      }),
  });

  return api;
}