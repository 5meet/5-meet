import { NextRequest, NextResponse } from "next/server";

import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";

interface RouteContext {
  params: Promise<{
    meetingId: string;
  }>;
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { meetingId } = await context.params;
    const parsedMeetingId = Number(meetingId);

    if (
      !Number.isInteger(parsedMeetingId) ||
      parsedMeetingId <= 0
    ) {
      return NextResponse.json(
        { message: "올바른 meetingId가 아닙니다." },
        { status: 400 },
      );
    }

    await serverFetchWithTokenRefresh(
      `/meetings/${parsedMeetingId}/favorites`,
      { method: "DELETE" },
    );

    return NextResponse.json({
      message: "즐겨찾기 해제 성공",
    });
  } catch (error) {
    console.error("즐겨찾기 해제 실패:", error);

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
            : "즐겨찾기 해제에 실패했습니다.",
      },
      { status },
    );
  }
}