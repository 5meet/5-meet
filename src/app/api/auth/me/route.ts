import { NextResponse } from "next/server";

import { ApiError } from "@/lib/api/ApiError";
import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";

import type { User } from "@/features/auth/type";

// 유저 정보를 받아오는 라우트 헨들러
export async function GET() {

  try {
    const user = await serverFetchWithTokenRefresh<User>("/users/me");
    console.log("유저 정보 router handler", user);
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status ?? 500 },
      );
    }
    return NextResponse.json(
      { message: "사용자 정보를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
