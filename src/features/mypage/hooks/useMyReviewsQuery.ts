
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

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    console.error("[나의 리뷰 네트워크 오류]", {
      url,
      message,
    });

    throw new Error(`나의 리뷰 요청에 실패했습니다: ${message}`);
  }

  const responseText = await response.text();

  if (!response.ok) {
    const errorMessage = [
      "[나의 리뷰 조회 실패]",
      `URL: ${url}`,
      `HTTP 상태: ${response.status}`,
      `상태 메시지: ${response.statusText}`,
      `응답 본문: ${responseText || "(응답 본문 없음)"}`,
    ].join("\n");

    console.error(errorMessage);

    throw new Error(
      `나의 리뷰 조회 실패 (${response.status}): ${
        responseText || response.statusText
      }`,
    );
  }

  let result: MyReviewsResponse;

  try {
    result = JSON.parse(responseText) as MyReviewsResponse;
  } catch {
    console.error("[나의 리뷰 JSON 파싱 실패]", responseText);
    throw new Error("나의 리뷰 응답이 올바른 JSON 형식이 아닙니다.");
  }

  if (
    !result ||
    !Array.isArray(result.data) ||
    typeof result.hasMore !== "boolean"
  ) {
    console.error("[나의 리뷰 응답 구조 오류]", result);
    throw new Error("나의 리뷰 응답 데이터 구조가 올바르지 않습니다.");
  }

  return result;
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
      fetchMyReviews(sortBy, sortOrder, size, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.nextCursor ?? undefined;
    },
  });
}