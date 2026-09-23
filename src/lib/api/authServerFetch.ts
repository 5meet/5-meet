// 좋아요 버튼, 모임 생성 등 사용자 행동 + 인증이 필요한 경우 이 함수를 통해서 데이터를 요청합니다.

import { cookies } from "next/headers";

import { ApiError } from "./ApiError";
import { serverFetch } from "./serverFetch";
import { refreshToken } from "@/lib/auth/refreshToken";

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface AuthFetchOptions extends RequestInit {
  timeout?: number;
}

export async function authServerFetch<T>(
  url: string,
  options: AuthFetchOptions = {},
): Promise<T> {
  try {
    // 1. 기존 Access Token으로 요청
    return await serverFetch<T>(url, {
      ...options,
      auth: true,
    });
  } catch (error) {
    // 2. 401이 아닌 에러는 그대로 전달
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }

    // 3. 401이면 Refresh Token 확인
    const cookieStore = await cookies();

    const currentRefreshToken = cookieStore.get("refreshToken")?.value;

    if (!currentRefreshToken) {
      throw new ApiError(
        "로그인이 필요합니다.",
        "UNAUTHORIZED",
        401,
      );
    }

    // 4. Refresh API 요청
    const refreshResponse = await refreshToken(currentRefreshToken);

    // 5. Refresh Token도 만료/무효
    if (refreshResponse.status === 401) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      throw new ApiError(
        "로그인이 만료되었습니다. 다시 로그인해주세요.",
        "UNAUTHORIZED",
        401,
      );
    }

    // 6. Refresh 서버 오류
    if (!refreshResponse.ok) {
      throw new ApiError(
        "토큰 갱신 중 오류가 발생했습니다.",
        "REFRESH_ERROR",
        refreshResponse.status,
      );
    }

    // 7. 새로운 토큰 받기
    const tokens = (await refreshResponse.json()) as RefreshTokenResponse;

    // 8. 새로운 토큰을 HttpOnly Cookie에 저장
    cookieStore.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // 9. 새로운 Access Token으로 원래 요청 1회 재시도
    // Cookie를 다시 읽는 것에 의존하지 않고,
    // 방금 발급받은 Access Token을 Authorization 헤더로 직접 전달
    const retryHeaders = new Headers(options.headers);

    retryHeaders.set(
      "Authorization",
      `Bearer ${tokens.accessToken}`,
    );

    return serverFetch<T>(url, {
      ...options,
      auth: true,
      headers: retryHeaders,
    });
  }
}