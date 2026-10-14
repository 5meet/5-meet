
import { NextRequest, NextResponse } from "next/server";

import { getMyReviews } from "@/features/mypage/api/getMyReviews";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const sortByValue = searchParams.get("sortBy") ?? "createdAt";
    const sortOrderValue = searchParams.get("sortOrder") ?? "desc";
    const size = Number(searchParams.get("size") ?? "10");
    const cursor = searchParams.get("cursor") ?? undefined;

    if (
      sortByValue !== "createdAt" &&
      sortByValue !== "score"
    ) {
      return NextResponse.json(
        { message: "유효하지 않은 sortBy 값입니다." },
        { status: 400 },
      );
    }

    if (
      sortOrderValue !== "asc" &&
      sortOrderValue !== "desc"
    ) {
      return NextResponse.json(
        { message: "유효하지 않은 sortOrder 값입니다." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(size) || size < 1 || size > 100) {
      return NextResponse.json(
        { message: "size는 1~100 사이의 정수여야 합니다." },
        { status: 400 },
      );
    }

    const result = await getMyReviews({
      teamId: "5-meet",
      sortBy: sortByValue,
      sortOrder: sortOrderValue,
      size,
      cursor,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 서버 오류가 발생했습니다.";

    console.error("[나의 리뷰 Route Handler 오류]", message);

    const status = message.includes("accessToken")
      ? 401
      : 500;

    return NextResponse.json(
      { message },
      { status },
    );
  }
}