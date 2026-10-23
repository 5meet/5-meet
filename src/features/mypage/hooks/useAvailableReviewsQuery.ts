"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { AvailableReviewsResponse } from "@/features/mypage/api/getAvailableReviews";

interface UseAvailableReviewsQueryParams {
  size?: number;
}

async function fetchAvailableReviews(
  size: number,
  cursor?: string,
): Promise<AvailableReviewsResponse> {
  const searchParams = new URLSearchParams({
    size: String(size),
  });

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const url = `/api/mypage/available-reviews?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "작성 가능한 리뷰 조회 실패",
      response.status,
      errorText,
    );

    throw new Error(
      `작성 가능한 리뷰 조회 실패 (${response.status})`,
    );
  }

  const data = (await response.json()) as AvailableReviewsResponse;

  return data;
}

export function useAvailableReviewsQuery({
  size = 10,
}: UseAvailableReviewsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ["mypage", "reviews", "available", size],

    queryFn: ({ pageParam }) => fetchAvailableReviews(size, pageParam),

    initialPageParam: undefined as string | undefined,

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.nextCursor ?? undefined;
    },
  });
}