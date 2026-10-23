import { NextRequest, NextResponse } from "next/server";

import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString();

    const url = searchParams
      ? `/favorites?${searchParams}`
      : "/favorites";

    const data = await serverFetchWithTokenRefresh<unknown>(url);

    return NextResponse.json(data);
  } catch (error) {
    console.error("즐겨찾기 목록 조회 실패:", error);

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
            : "즐겨찾기 목록을 불러오지 못했습니다.",
      },
      { status },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      meetingId: number;
    };

    if (
      !Number.isInteger(body.meetingId) ||
      body.meetingId <= 0
    ) {
      return NextResponse.json(
        { message: "올바른 meetingId가 필요합니다." },
        { status: 400 },
      );
    }

    const data = await serverFetchWithTokenRefresh<unknown>(
      `/meetings/${body.meetingId}/favorites`,
      { method: "POST" },
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("즐겨찾기 추가 실패:", error);

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
            : "즐겨찾기에 추가하지 못했습니다.",
      },
      { status },
    );
  }
}