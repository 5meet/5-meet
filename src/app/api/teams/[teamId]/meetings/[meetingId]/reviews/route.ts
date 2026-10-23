import { NextRequest, NextResponse } from "next/server";

import { ApiError } from "@/lib/api/ApiError";
import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";

type RouteContext = {
  params: Promise<{
    teamId: string;
    meetingId: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { meetingId } = await context.params;

    if (!/^\d+$/.test(meetingId)) {
      return NextResponse.json(
        { message: "올바르지 않은 모임 ID입니다." },
        { status: 400 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "요청 본문이 올바른 JSON 형식이 아닙니다." },
        { status: 400 },
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("score" in body) ||
      typeof body.score !== "number" ||
      !Number.isInteger(body.score) ||
      body.score < 1 ||
      body.score > 5 ||
      !("comment" in body) ||
      typeof body.comment !== "string"
    ) {
      return NextResponse.json(
        { message: "리뷰 점수 또는 내용이 올바르지 않습니다." },
        { status: 400 },
      );
    }

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