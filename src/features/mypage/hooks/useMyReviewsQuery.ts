"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type {
  MyReviewsResponse,
  MyReviewsSortBy,
  MyReviewsSortOrder,
} from "@/features/mypage/api/getMyReviews";

interface UseMyReviewsQueryParams {
  sortBy?: MyReviewsSortBy;
  sortOrder?: MyReviewsSortOrder;
  size?: number;
}

async function fetchMyReviews(
  sortBy: MyReviewsSortBy,
  sortOrder: MyReviewsSortOrder,
  size: number,
  cursor?: string,
): Promise<MyReviewsResponse> {
  const searchParams = new URLSearchParams({
    sortBy,
    sortOrder,
    size: String(size),
  });

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const url = `/api/mypage/reviews?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("나의 리뷰 조회 실패");
    console.error("status:", response.status);
    console.error("response:", errorText);

    throw new Error(
      `나의 리뷰 조회 실패 (${response.status})`,
    );
  }

  return response.json() as Promise<MyReviewsResponse>;
}

export function useMyReviewsQuery({
  sortBy = "createdAt",
  sortOrder = "desc",
  size = 10,
}: UseMyReviewsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: [
      "mypage",
      "reviews",
      "written",
      sortBy,
      sortOrder,
      size,
    ],

    queryFn: ({ pageParam }) =>
      fetchMyReviews(
        sortBy,
        sortOrder,
        size,
        pageParam,
      ),

    initialPageParam: undefined as
      | string
      | undefined,

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.nextCursor ?? undefined;
    },
  });
}