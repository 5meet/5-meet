import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/serverFetch";

export async function GET(request: NextRequest) {
  try {
    const searchParams =
      request.nextUrl.searchParams.toString();

    const url = searchParams
      ? `/favorites?${searchParams}`
      : "/favorites";

    const data = await serverFetch<unknown>(url, {
      auth: true,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("찜한 모임 조회 실패:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "찜한 모임을 불러오지 못했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body = (await request.json()) as {
      meetingId: number;
    };

    if (!body.meetingId) {
      return NextResponse.json(
        {
          message: "meetingId가 필요합니다.",
        },
        {
          status: 400,
        },
      );
    }

    const data = await serverFetch<unknown>(
      `/meetings/${body.meetingId}/favorites`,
      {
        method: "POST",
        auth: true,
      },
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("찜 추가 실패:", error);

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
            : "찜하기에 실패했습니다.",
      },
      {
        status,
      },
    );
  }
}