import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/ApiError";
import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";

type Context = { params: Promise<{ meetingId: string }> };

async function toggle(method: "POST" | "DELETE", context: Context) {
  const { meetingId } = await context.params;
  if (!/^[1-9]\d*$/.test(meetingId)) {
    return NextResponse.json(
      { message: "잘못된 모임 번호입니다." },
      { status: 400 },
    );
  }
  try {
    await serverFetchWithTokenRefresh(`/meetings/${meetingId}/favorites`, {
      method,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status ?? 500 },
      );
    }
    return NextResponse.json(
      { message: "찜 상태를 변경하지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(_request: Request, context: Context) {
  return toggle("POST", context);
}

export async function DELETE(_request: Request, context: Context) {
  return toggle("DELETE", context);
}
