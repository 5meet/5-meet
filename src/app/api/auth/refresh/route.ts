import { NextRequest, NextResponse } from "next/server";

import { refreshToken } from "@/lib/auth/refreshToken";
import type { RefreshTokenResponse } from "@/lib/auth/type";
import {
  AUTH_COOKIE,
  clearAuthCookies,
  setRefreshedAuthCookies,
} from "@/lib/auth/authCookies";

export async function GET(request: NextRequest) {
  // 1. 토큰 갱신 후 돌아갈 페이지 확인
  const redirectPath = request.nextUrl.searchParams.get("redirect") ?? "/";

  // 2. 현재 Refresh Token 가져오기
  const currentRefreshToken = request.cookies.get(
    AUTH_COOKIE.REFRESH_TOKEN,
  )?.value;

  // 3. Refresh Token이 없으면 로그인 페이지로 이동
  if (!currentRefreshToken) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirect", redirectPath);

    return NextResponse.redirect(loginUrl);
  }

  try {
    // 4. 백엔드 POST /auth/refresh 호출
    const refreshResponse = await refreshToken(currentRefreshToken);

    // 5. Refresh Token도 만료되었거나 유효하지 않은 경우
    if (refreshResponse.status === 401) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("redirect", redirectPath);

      const response = NextResponse.redirect(loginUrl);

      clearAuthCookies(response.cookies);

      return response;
    }

    // 6. 백엔드 Refresh API 자체에서 오류가 발생한 경우
    if (!refreshResponse.ok) {
      return new NextResponse("토큰 갱신 중 오류가 발생했습니다.", {
        status: 503,
      });
    }

    // 7. 새 토큰 가져오기
    const refreshedTokens =
      (await refreshResponse.json()) as RefreshTokenResponse;

    // 8. 원래 페이지로 돌아가는 응답 생성
    const response = NextResponse.redirect(new URL(redirectPath, request.url));

    // 9. 브라우저에 새로운 토큰 저장
    setRefreshedAuthCookies(response.cookies, refreshedTokens);

    return response;
  } catch {
    return new NextResponse("네트워크 연결이 불안정합니다.", { status: 503 });
  }
}
