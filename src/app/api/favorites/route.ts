import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/serverFetch";

function getErrorStatus(error: unknown): number {
  if (
    error instanceof Error &&
    "status" in error &&
    typeof error.status === "number" &&
    Number.isInteger(error.status) &&
    error.status >= 400 &&
    error.status <= 599
  ) {
    return error.status;
  }

  return 500;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString();
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
        status: getErrorStatus(error),
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("meetingId" in body) ||
      typeof body.meetingId !== "number" ||
      !Number.isSafeInteger(body.meetingId) ||
      body.meetingId <= 0
    ) {
      return NextResponse.json(
        {
          message: "meetingId는 양의 정수여야 합니다.",
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

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "찜하기에 실패했습니다.",
      },
      {
        status: getErrorStatus(error),
      },
    );
  }
}