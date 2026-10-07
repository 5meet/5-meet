import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/serverFetch";

export async function GET(
  request: NextRequest,
) {
  const teamId =
    request.nextUrl.searchParams.get(
      "teamId",
    );

  if (!teamId) {
    return NextResponse.json(
      {
        message:
          "teamId가 필요합니다.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const response = await serverFetch(
      `/${teamId}/reviews/statistics`,
      {
        auth: true,
      },
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "리뷰 통계 조회 실패:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "리뷰 통계를 불러오지 못했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}