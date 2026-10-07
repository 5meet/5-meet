import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/serverFetch";
import type {
  GetReviewsResponse,
} from "@/features/reviews/types";

export async function GET(
  request: NextRequest,
) {
  try {
    const searchParams =
      request.nextUrl.searchParams.toString();

    const url = searchParams
      ? `/reviews?${searchParams}`
      : "/reviews";

    const data =
      await serverFetch<GetReviewsResponse>(
        url,
        {
          auth: true,
        },
      );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "리뷰 목록 조회 실패:",
      error,
    );

    const status =
      error instanceof Error &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 500;

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "리뷰를 불러오지 못했습니다.",
      },
      {
        status,
      },
    );
  }
}