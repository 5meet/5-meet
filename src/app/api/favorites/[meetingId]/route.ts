  import { NextRequest, NextResponse } from "next/server";

import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";

interface RouteContext {
  params: Promise<{
    meetingId: string;
  }>;
}

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

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { meetingId } = await context.params;
    const parsedMeetingId = Number(meetingId);

    if (
      !Number.isSafeInteger(parsedMeetingId) ||
      parsedMeetingId <= 0
    ) {
      return NextResponse.json(
        { message: "meetingId는 양의 정수여야 합니다." },
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

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "즐겨찾기 해제에 실패했습니다.",
      },
      { status: getErrorStatus(error) },
    );
  }
}