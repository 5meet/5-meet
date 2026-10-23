import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getAvailableReviews } from "@/features/mypage/api/getAvailableReviews";

export async function GET(request: NextRequest) {
  const searchParams =
    request.nextUrl.searchParams;

  const sizeParam = searchParams.get("size");

  const size = sizeParam
    ? Number(sizeParam)
    : 10;

  const cursor =
    searchParams.get("cursor") ?? undefined;

  console.log(
    "GET /api/mypage/available-reviews",
  );
  console.log("size:", size);
  console.log("cursor:", cursor);

  try {
    const data = await getAvailableReviews({
      size,
      cursor,
    });

    console.log(
      "작성 가능한 리뷰 API 성공",
    );
    console.log(
      "data count:",
      data.data.length,
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "작성 가능한 리뷰 조회 실패:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "작성 가능한 리뷰를 불러오지 못했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}