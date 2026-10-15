
import { NextRequest, NextResponse } from "next/server";

import { ApiError } from "@/lib/api/ApiError";
import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";

const BASE_URL = process.env.NEXT_PUBLIC_CODEIT_API_URL;

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      teamId: string;
      meetingId: string;
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

    const { meetingId } = await context.params;
    const body = await request.json();

    const result = await serverFetchWithTokenRefresh<unknown>(
      `/meetings/${encodeURIComponent(meetingId)}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    return NextResponse.json(result ?? null, { status: 200 });
  } catch (error) {
    console.error("[리뷰 작성 서버 오류]", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "리뷰 작성 요청 중 서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
