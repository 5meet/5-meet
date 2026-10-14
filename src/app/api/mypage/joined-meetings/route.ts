import { NextRequest, NextResponse } from "next/server";

import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";
import { ApiError } from "@/lib/api/ApiError";
import type {
  JoinedMeetingsParams,
  JoinedMeetingsResponse,
} from "@/features/mypage/my-meetings/types";

/** Authenticated BFF: browser never receives the access/refresh tokens. */
export async function GET(request: NextRequest) {
  const incoming = request.nextUrl.searchParams;
  const params = new URLSearchParams();

  for (const key of ["cursor", "size", "completed", "reviewed", "sortBy", "sortOrder"] as const) {
    const value = incoming.get(key);
    if (value !== null) params.set(key, value);
  }

  const size = params.get("size");
  if (size !== null && (!/^\d+$/.test(size) || Number(size) < 1 || Number(size) > 100)) {
    return NextResponse.json({ message: "잘못된 페이지 크기입니다." }, { status: 400 });
  }

  const query = params.toString();
  const path = `/meetings/joined${query ? `?${query}` : ""}`;

  try {
    const result = await serverFetchWithTokenRefresh<JoinedMeetingsResponse>(path);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status ?? 500 },
      );
    }
    return NextResponse.json(
      { message: "모임 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export type { JoinedMeetingsParams };
