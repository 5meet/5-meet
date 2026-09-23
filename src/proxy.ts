// 인증이 필요한 페이지에 들어갈 경우 token을 검사하고 access, refresh 모두 없으면 로그인 페이지로 이동, refresh만 있으면 재발급, access, refresh 모두 있으면 넘어감

import { NextRequest, NextResponse } from "next/server";

import { refreshToken } from "@/lib/auth/refreshToken";
import { isTokenExpired } from "@/lib/auth/isTokenExpired";

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const currentRefreshToken = request.cookies.get("refreshToken")?.value;

  /**
   * 1. Access Token이 존재하고 유효하면 통과
   */
  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  /**
   * 2. Access Token이 없거나 만료됐는데
   * Refresh Token도 없다면 로그인 필요
   */
  if (!currentRefreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    /**
     * 3. Refresh Token으로 새로운 토큰 요청
     */
    const refreshResponse = await refreshToken(currentRefreshToken);

    /**
     * 4. Refresh Token 만료 / 무효
     *
     * 실제 인증이 만료된 경우이므로
     * 기존 토큰을 제거하고 로그인 페이지로 이동
     */
    if (refreshResponse.status === 401) {
      const response = NextResponse.redirect(new URL("/login", request.url));

      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
    }

    /**
     * 5. 401 이외의 서버 오류
     *
     * 인증 만료라고 판단할 수 없으므로
     * 쿠키를 삭제하거나 로그인 페이지로 보내지 않음
     */
    if (!refreshResponse.ok) {
      return new NextResponse(
        "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        {
          status: 503,
        },
      );
    }

    /**
     * 6. Refresh 성공
     */
    const tokens = (await refreshResponse.json()) as RefreshTokenResponse;

    /**
     * 7. 현재 요청에 새로운 Cookie 적용
     *
     * 이후 실행되는 Server Component에서도
     * 새로운 Access Token을 읽을 수 있게 함
     */
    const requestHeaders = new Headers(request.headers);

    const cookies = request.cookies
      .getAll()
      .filter(
        (cookie) =>
          cookie.name !== "accessToken" && cookie.name !== "refreshToken",
      )
      .map((cookie) => `${cookie.name}=${cookie.value}`);

    cookies.push(
      `accessToken=${tokens.accessToken}`,
      `refreshToken=${tokens.refreshToken}`,
    );

    requestHeaders.set("cookie", cookies.join("; "));

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    /**
     * 8. 브라우저 Cookie에도 새로운 토큰 저장
     */
    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch {
    /**
     * fetch 자체가 실패한 경우
     *
     * 네트워크/DNS 등의 문제일 가능성이 있으므로
     * 인증 만료로 판단하지 않음.
     *
     * 따라서:
     * - Cookie 삭제 X
     * - /login redirect X
     */
    return new NextResponse(
      "네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.",
      {
        status: 503,
      },
    );
  }
}

export const config = {
  matcher: ["/mypage/created-meetings", "/mypage/meetings", "/mypage/reviews"],
};
