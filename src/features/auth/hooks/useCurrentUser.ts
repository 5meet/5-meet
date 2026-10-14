"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUserClient } from "@/features/auth/api/getCurrentUserClient";

export const CURRENT_USER_QUERY_KEY = ["auth", "me"] as const;

// 유저 정보를 요청하는 react query
export function useCurrentUser({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUserClient,
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
