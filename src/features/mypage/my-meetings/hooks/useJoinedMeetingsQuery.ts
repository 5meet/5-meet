"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { JoinedMeetingsResponse } from "../types";

export const joinedMeetingsQueryKeys = {
  all: ["mypage", "joined-meetings"] as const,
  list: () => [...joinedMeetingsQueryKeys.all, "list"] as const,
};

async function getJoinedMeetings(
  cursor?: string,
  signal?: AbortSignal,
): Promise<JoinedMeetingsResponse> {
  const params = new URLSearchParams({
    size: "10",
    sortBy: "dateTime",
    sortOrder: "asc",
  });
  if (cursor) params.set("cursor", cursor);
  const response = await fetch(
    `/api/mypage/joined-meetings?${params.toString()}`,
    { signal },
  );
  if (!response.ok) throw new Error("참여한 모임 목록 조회에 실패했습니다.");
  return (await response.json()) as JoinedMeetingsResponse;
}

export function useJoinedMeetingsQuery() {
  return useInfiniteQuery({
    queryKey: joinedMeetingsQueryKeys.list(),
    queryFn: ({ pageParam, signal }) => getJoinedMeetings(pageParam, signal),
    // Private account data must not survive leaving this page and signing in again.
    gcTime: 0,
    staleTime: 0,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}
