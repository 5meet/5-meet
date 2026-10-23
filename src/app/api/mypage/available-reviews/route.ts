import { NextRequest, NextResponse } from "next/server";

import { getAvailableReviews } from "@/features/mypage/api/getAvailableReviews";
import { ApiError } from "@/lib/api/ApiError";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const sizeParam = searchParams.get("size");
  const parsedSize = sizeParam ? Number(sizeParam) : 10;
  const size =
    Number.isInteger(parsedSize) && parsedSize > 0
      ? parsedSize
      : 10;

  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const data = await getAvailableReviews({ size, cursor });

    return NextResponse.json(data);
  } catch (error) {
    console.error("작성 가능한 리뷰 조회 실패:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          message: error.message,
          code: error.code,
        },
        {
          status: error.status ?? 500,
        },
      );
    }

    return NextResponse.json(
      { message: "작성 가능한 리뷰를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}