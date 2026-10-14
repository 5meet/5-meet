
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

export type MyReviewsSortBy = "createdAt" | "score";
export type MyReviewsSortOrder = "asc" | "desc";

interface GetMyReviewsParams {
  teamId: string;
  sortBy?: MyReviewsSortBy;
  sortOrder?: MyReviewsSortOrder;
  size?: number;
  cursor?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_CODEIT_API_URL;

export async function getMyReviews({
  teamId,
  sortBy = "createdAt",
  sortOrder = "desc",
  size = 10,
  cursor,
}: GetMyReviewsParams): Promise<MyReviewsResponse> {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_CODEIT_API_URL 환경 변수가 설정되지 않았습니다.");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("accessToken 쿠키가 없습니다. 로그인이 필요합니다.");
  }

  const searchParams = new URLSearchParams({
    sortBy,
    sortOrder,
    size: String(size),
  });

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const url = `${BASE_URL}/users/me/reviews?${searchParams.toString()}`;

  console.info("[나의 리뷰 요청]", {
    url,
    teamId,
    hasAccessToken: Boolean(accessToken),
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error(
      [
        "[백엔드 나의 리뷰 조회 실패]",
        `URL: ${url}`,
        `HTTP 상태: ${response.status}`,
        `상태 메시지: ${response.statusText}`,
        `응답 본문: ${responseText || "(응답 본문 없음)"}`,
      ].join("\n"),
    );

    throw new Error(
      `나의 리뷰 조회 실패 (${response.status}): ${responseText}`,
    );
  }

  try {
    return JSON.parse(responseText) as MyReviewsResponse;
  } catch {
    throw new Error(
      `나의 리뷰 응답 JSON 파싱 실패: ${responseText}`,
    );
  }
}