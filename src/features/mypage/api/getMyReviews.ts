import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";
import type { ReviewApiItem } from "@/features/reviews/types";

export interface MyReviewMeeting {
  id: number;
  type: string;
  name: string;
  region: string;
  image: string;
  dateTime: string;
}

export interface MyReview extends Omit<ReviewApiItem, "meeting"> {
  meeting: MyReviewMeeting;
}

export interface MyReviewsResponse {
  data: MyReview[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type MyReviewsSortBy = "createdAt" | "score";
export type MyReviewsSortOrder = "asc" | "desc";

interface GetMyReviewsParams {
  sortBy?: MyReviewsSortBy;
  sortOrder?: MyReviewsSortOrder;
  size?: number;
  cursor?: string;
}

export async function getMyReviews({
  sortBy = "createdAt",
  sortOrder = "desc",
  size = 10,
  cursor,
}: GetMyReviewsParams): Promise<MyReviewsResponse> {
  const searchParams = new URLSearchParams({
    sortBy,
    sortOrder,
    size: String(size),
  });

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const url = `/users/me/reviews?${searchParams.toString()}`;

  return serverFetchWithTokenRefresh<MyReviewsResponse>(url, {
    method: "GET",
    cache: "no-store",
  });
}