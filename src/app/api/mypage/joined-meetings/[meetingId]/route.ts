import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/ApiError";
import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ meetingId: string }> },
) {
  const { meetingId } = await context.params;
  if (!/^[1-9]\d*$/.test(meetingId)) {
    return NextResponse.json({ message: "잘못된 모임 번호입니다." }, { status: 400 });
  }

  try {
    await serverFetchWithTokenRefresh<{ message: string }>(
      `/meetings/${meetingId}/join`,
      { method: "DELETE" },
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status ?? 500 },
      );
    }
    return NextResponse.json(
      { message: "예약을 취소하지 못했습니다." },
      { status: 500 },
    );
  }
}
