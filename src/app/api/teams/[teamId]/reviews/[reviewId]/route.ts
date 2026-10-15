
import { NextRequest, NextResponse } from "next/server";

import { ApiError } from "@/lib/api/ApiError";
import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";

const BASE_URL = process.env.NEXT_PUBLIC_CODEIT_API_URL;

function handleApiError(error: unknown, fallbackMessage: string) {
  console.error(fallbackMessage, error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message, code: error.code },
      { status: error.status ?? 500 },
    );
  }

  return NextResponse.json(
    { message: fallbackMessage },
    { status: 500 },
  );
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      teamId: string;
      reviewId: string;
    }>;
  },
) {
  try {
    if (!BASE_URL) {
      return NextResponse.json(
        { message: "API 기본 URL이 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const { reviewId } = await context.params;

    if (!Number.isInteger(Number(reviewId)) || Number(reviewId) <= 0) {
      return NextResponse.json(
        { message: "올바르지 않은 리뷰 ID입니다." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { score, comment } = body;

    if (
      !Number.isInteger(score) ||
      score < 1 ||
      score > 5 ||
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return NextResponse.json(
        { message: "별점과 리뷰 내용을 확인해 주세요." },
        { status: 400 },
      );
    }

    const result = await serverFetchWithTokenRefresh<unknown>(
      `/reviews/${encodeURIComponent(reviewId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          score,
          comment: comment.trim(),
        }),
        cache: "no-store",
      },
    );

    return NextResponse.json(result ?? {
      message: "리뷰 수정 요청이 처리되었습니다.",
    });
  } catch (error) {
    return handleApiError(error, "리뷰 수정 중 서버 오류가 발생했습니다.");
  }
}

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{
      teamId: string;
      reviewId: string;
    }>;
  },
) {
  try {
    if (!BASE_URL) {
      return NextResponse.json(
        { message: "API 기본 URL이 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const { reviewId } = await context.params;

    if (!Number.isInteger(Number(reviewId)) || Number(reviewId) <= 0) {
      return NextResponse.json(
        { message: "올바르지 않은 리뷰 ID입니다." },
        { status: 400 },
      );
    }

    const result = await serverFetchWithTokenRefresh<unknown>(
      `/reviews/${encodeURIComponent(reviewId)}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    return NextResponse.json(result ?? {
      message: "요청이 처리되었습니다.",
    });
  } catch (error) {
    return handleApiError(error, "리뷰 삭제 중 서버 오류가 발생했습니다.");
  }
}
