
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getMeetings } from "../api/getMeetings";

export function useMeetingsInfiniteQuery(keyword?: string) {
  return useInfiniteQuery({
    queryKey: ["meetings", "infinite", keyword ?? ""],

    initialPageParam: null as string | null,

    queryFn: ({ pageParam }) =>
      getMeetings({
        keyword,
        cursor: pageParam ?? undefined,
        size: 20,
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.nextCursor ?? undefined;
    },
  });
}
