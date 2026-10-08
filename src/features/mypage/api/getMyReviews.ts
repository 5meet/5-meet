import { cookies } from "next/headers";

export interface MyReviewMeeting {
  id: number;
  type: string;
  name: string;
  image: string;
  dateTime: string;
}

export interface MyReview {
  id: number;
  score: number;
  comment: string;
  meetingId: number;
  meeting: MyReviewMeeting;
  createdAt: string;
}

export interface MyReviewsResponse {
  data: MyReview[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type MyReviewsSortBy =
  | "createdAt"
  | "score";

export type MyReviewsSortOrder =
  | "asc"
  | "desc";

interface GetMyReviewsParams {
  teamId: string;
  sortBy?: MyReviewsSortBy;
  sortOrder?: MyReviewsSortOrder;
  size?: number;
  cursor?: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_CODEIT_API_URL;

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

  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("accessToken")?.value;

  const url =
    `${BASE_URL}/users/me/reviews?` +
    searchParams.toString();

  console.log("MY REVIEWS REQUEST");
  console.log("url:", url);
  console.log(
    "has accessToken:",
    Boolean(accessToken),
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
    },
    cache: "no-store",
  });

  const responseText = await response.text();

  console.log("MY REVIEWS RESPONSE");
  console.log("status:", response.status);
  console.log("response:", responseText);

  if (!response.ok) {
    throw new Error(
      `나의 리뷰 조회 실패 (${response.status}): ${responseText}`,
    );
  }

  try {
    return JSON.parse(
      responseText,
    ) as MyReviewsResponse;
  } catch {
    throw new Error(
      `나의 리뷰 응답 형식이 올바르지 않습니다: ${responseText}`,
    );
  }
}