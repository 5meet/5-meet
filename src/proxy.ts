import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE } from "./lib/auth/authCookies";

/**
 * 보호된 페이지 접근 시 인증 정보가 존재하는지 확인합니다.
 *
 * - Access Token 또는 Refresh Token이 존재하면 페이지 접근 허용
 * - 두 토큰이 모두 없으면 로그인 페이지로 이동
 *
 * 토큰 만료 및 갱신은 Proxy에서 처리하지 않습니다.
 */
export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(
    AUTH_COOKIE.ACCESS_TOKEN,
  )?.value;

  const refreshToken = request.cookies.get(
    AUTH_COOKIE.REFRESH_TOKEN,
  )?.value;

  /**
   * Access Token과 Refresh Token이 모두 없는 경우
   * 로그인 페이지로 이동
   */
  if (!accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search,
    );

    return NextResponse.redirect(loginUrl);
  }

  /**
   * 인증 관련 토큰이 하나라도 존재하면 통과
   *
   * 실제 Access Token의 유효성은 API 요청 시 확인하고,
   * 401이 발생하면 serverFetchForPage에서 갱신 흐름을 시작합니다.
   */
  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*", "/favorites"],
};