import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/ApiError";
import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";
import type { CreatedMeetingsResponse } from "@/features/mypage/created-meetings/types";

export async function GET(request: NextRequest) {
  const incoming = request.nextUrl.searchParams;
  const size = incoming.get("size") ?? "10";
  if (!/^\d+$/.test(size) || Number(size) < 1 || Number(size) > 50) {
    return NextResponse.json({ message: "잘못된 페이지 크기입니다." }, { status: 400 });
  }
  // Account ownership is decided by the authenticated upstream, never browser IDs.
  const params = new URLSearchParams({ type: "created", size, sortBy: "createdAt", sortOrder: "desc" });
  const cursor = incoming.get("cursor");
  if (cursor) params.set("cursor", cursor);

  try {
    const result = await serverFetchWithTokenRefresh<CreatedMeetingsResponse>(
      `/users/me/meetings?${params.toString()}`,
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ code: error.code, message: error.message }, { status: error.status ?? 500 });
    }
    return NextResponse.json({ message: "내가 만든 모임을 불러오지 못했습니다." }, { status: 500 });
  }
}
