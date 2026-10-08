/**
 * Server Action / Route Handler 전용 인증 Fetch Wrapper입니다.
 *
 * 요청이 401이면 Refresh Token으로 토큰을 갱신한 뒤
 * 새로운 Access Token으로 원래 요청을 한 번 재시도합니다.
 *
 * @note 쿠키를 수정하므로 Server Component에서는 사용할 수 없습니다.
 */

import { cookies } from "next/headers";

import { ApiError } from "./ApiError";
import { serverFetch } from "./serverFetch";
import { refreshToken } from "@/lib/auth/refreshToken";

import type {
  BaseFetchOptions,
  RefreshTokenResponse,
} from "../auth/type";

import {
  AUTH_COOKIE,
  clearAuthCookies,
  setRefreshedAuthCookies,
} from "../auth/authCookies";

export async function serverFetchWithTokenRefresh<T>(
  url: string,
  options: BaseFetchOptions = {},
): Promise<T> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(AUTH_COOKIE.ACCESS_TOKEN)?.value;
  const refreshTokenValue = cookieStore.get(AUTH_COOKIE.REFRESH_TOKEN)?.value;

  // 1. AT와 RT가 모두 없다면 API 요청 없이 401 반환
  if (!accessToken && !refreshTokenValue) {
    throw new ApiError(
      "로그인이 필요합니다.",
      "UNAUTHORIZED",
      401,
    );
  }

  try {
    // 2. 기존 Access Token으로 요청
    return await serverFetch<T>(url, {
      ...options,
      auth: true,
    });
  } catch (error) {
    // 3. 401이 아닌 에러는 그대로 전달
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }

    // 4. Refresh Token이 없다면 갱신 불가능
    //accessToken이 있지만 만료된 경우
    if (!refreshTokenValue) {
      throw new ApiError(
        "로그인이 필요합니다.",
        "UNAUTHORIZED",
        401,
      );
    }

    // 5. Refresh API 요청
    const refreshResponse = await refreshToken(refreshTokenValue);

    // 6. Refresh Token도 만료되었거나 무효한 경우
    if (refreshResponse.status === 401) {
      clearAuthCookies(cookieStore);

      throw new ApiError(
        "로그인이 만료되었습니다. 다시 로그인해주세요.",
        "UNAUTHORIZED",
        401,
      );
    }

    // 7. Refresh 서버 오류
    if (!refreshResponse.ok) {
      throw new ApiError(
        "토큰 갱신 중 오류가 발생했습니다.",
        "REFRESH_ERROR",
        refreshResponse.status,
      );
    }

    // 8. 새로운 토큰 받기
    const refreshedTokens =
      (await refreshResponse.json()) as RefreshTokenResponse;

    // 9. 새로운 토큰을 HttpOnly Cookie에 저장
    setRefreshedAuthCookies(cookieStore, refreshedTokens);

    // 10. 새로운 Access Token으로 기존 요청 1회 재시도
    const retryHeaders = new Headers(options.headers);

    retryHeaders.set(
      "Authorization",
      `Bearer ${refreshedTokens.accessToken}`,
    );

    return serverFetch<T>(url, {
      ...options,
      auth: true,
      headers: retryHeaders,
    });
  }
}