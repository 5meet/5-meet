/**
 * 서버 액션 / Route Handler 전용입니다. (서버 컴포넌트에서는 쿠키를 수정할 수 없어 사용 불가)
 * 서버 컴포넌트에서 인증이 필요한 요청은 serverFetch(url, { auth: true })를 사용하고,
 * 토큰 갱신은 proxy.ts가 담당합니다.
 */

import { cookies } from "next/headers";

import { ApiError } from "./ApiError";
import { serverFetch } from "./serverFetch";
import { refreshToken } from "@/lib/auth/refreshToken";
import type {
  AuthToken,
  BaseFetchOptions,
  RefreshTokenResponse,
} from "../auth/type";
import {
  AUTH_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from "../auth/authCookies";

export async function serverFetchWithTokenRefresh<T>(
  url: string,
  options: BaseFetchOptions = {},
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

    const currentRefreshToken = cookieStore.get(
      AUTH_COOKIE.REFRESH_TOKEN,
    )?.value;

    if (!currentRefreshToken) {
      throw new ApiError("로그인이 필요합니다.", "UNAUTHORIZED", 401);
    }

    // 4. Refresh API 요청
    const refreshResponse = await refreshToken(currentRefreshToken);

    // 5. Refresh Token도 만료/무효
    if (refreshResponse.status === 401) {
      clearAuthCookies(cookieStore);

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
    const refreshedTokens =
      (await refreshResponse.json()) as RefreshTokenResponse;

    // refreshToken이 null일 경우 기존 refreshtoken 그대로 사용
    const tokens: AuthToken = {
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken ?? currentRefreshToken,
    };

    // 8. 새로운 토큰을 HttpOnly Cookie에 저장
    setAuthCookies(cookieStore, tokens);

    // 9. 새로운 Access Token으로 원래 요청 1회 재시도
    // Cookie를 다시 읽는 것에 의존하지 않고,
    // 방금 발급받은 Access Token을 Authorization 헤더로 직접 전달
    const retryHeaders = new Headers(options.headers);

    retryHeaders.set("Authorization", `Bearer ${tokens.accessToken}`);

    return serverFetch<T>(url, {
      ...options,
      auth: true,
      headers: retryHeaders,
    });
  }
}
