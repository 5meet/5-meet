"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { CreatedMeetingsResponse } from "../types";

export const createdMeetingsQueryKeys = {
  all: ["mypage", "created-meetings"] as const,
  list: () => [...createdMeetingsQueryKeys.all, "list"] as const,
};

async function getCreatedMeetings(cursor?: string, signal?: AbortSignal): Promise<CreatedMeetingsResponse> {
  const params = new URLSearchParams({ size: "10" });
  if (cursor) params.set("cursor", cursor);
  const response = await fetch(`/api/mypage/created-meetings?${params}`, { signal });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "내가 만든 모임을 불러오지 못했습니다.");
  }
  return response.json();
}

export function useCreatedMeetingsQuery() {
  return useInfiniteQuery({
    queryKey: createdMeetingsQueryKeys.list(),
    queryFn: ({ pageParam, signal }) => getCreatedMeetings(pageParam, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
    gcTime: 0,
    staleTime: 0,
  });
}
