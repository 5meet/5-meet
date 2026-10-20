"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getMeetings } from "../api/getMeetings";

interface MeetingFilters {
  type?: string;
  region?: string;
  dateStart?: string;
  dateEnd?: string;
  sortBy?: "registrationEnd";
  sortOrder?: "asc" | "desc";
}

export function useMeetingsInfiniteQuery(
  keyword?: string,
  filters: MeetingFilters = {},
) {
  return useInfiniteQuery({
    queryKey: ["meetings", "infinite", keyword ?? "", filters],

    initialPageParam: null as string | null,

    queryFn: ({ pageParam }) =>
      getMeetings({
        keyword,
        cursor: pageParam ?? undefined,
        size: 20,
        ...filters,
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.nextCursor ?? undefined;
    },
  });
}