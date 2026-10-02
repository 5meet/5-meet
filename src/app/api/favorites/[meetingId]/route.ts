import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/serverFetch";

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

    if (!Number.isInteger(parsedMeetingId)) {
      return NextResponse.json(
        {
          message: "올바른 meetingId가 아닙니다.",
        },
        {
          status: 400,
        },
      );
    }

    await serverFetch(
      `/meetings/${parsedMeetingId}/favorites`,
      {
        method: "DELETE",
        auth: true,
      },
    );

    return NextResponse.json({
      message: "찜 해제 성공",
    });
  } catch (error) {
    console.error("찜 해제 실패:", error);

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
            : "찜 해제에 실패했습니다.",
      },
      {
        status,
      },
    );
  }
}