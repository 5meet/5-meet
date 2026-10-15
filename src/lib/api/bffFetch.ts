import { cookies } from "next/headers";

import {
  AUTH_COOKIE,
  clearAuthCookies,
  setRefreshedAuthCookies,
} from "@/lib/auth/authCookies";
import { refreshToken } from "@/lib/auth/refreshToken";

import type { RefreshTokenResponse } from "@/lib/auth/type";

type BffFetchOptions = {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: string;
};

export async function bffFetch(
  path: string,
  options: BffFetchOptions,
): Promise<Response> {
  const apiBase = process.env.NEXT_PUBLIC_CODEIT_API_URL;

  if (!apiBase) {
    throw new Error("API 서버 주소가 설정되지 않았습니다.");
  }

  const cookieStore = await cookies();

  const accessToken = cookieStore.get(AUTH_COOKIE.ACCESS_TOKEN)?.value;
  const refreshTokenValue = cookieStore.get(AUTH_COOKIE.REFRESH_TOKEN)?.value;

  // AT와 RT가 모두 없으면 로그인 필요
  if (!accessToken && !refreshTokenValue) {
    return Response.json(
      {
        code: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      },
      { status: 401 },
    );
  }

  const url = `${apiBase.replace(/\/$/, "")}/${path}`;

  // AT를 전달해 백엔드에 요청하는 함수
  const requestWithToken = (token: string) => {
    const headers = new Headers();

    headers.set("Authorization", `Bearer ${token}`);

    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    return fetch(url, {
      method: options.method,
      headers,
      body: options.body,
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
  };

  // AT가 있다면 먼저 요청
  if (accessToken) {
    const response = await requestWithToken(accessToken);

    // 401이 아니라면 그대로 반환
    if (response.status !== 401) {
      return response;
    }
  }

  // RT가 없으면 갱신 불가능
  if (!refreshTokenValue) {
    return Response.json(
      {
        code: "UNAUTHORIZED",
        message: "로그인이 만료되었습니다.",
      },
      { status: 401 },
    );
  }

  // RT로 새 AT 발급
  const refreshResponse = await refreshToken(refreshTokenValue);

  if (refreshResponse.status === 401) {
    clearAuthCookies(cookieStore);

    return Response.json(
      {
        code: "UNAUTHORIZED",
        message: "로그인이 만료되었습니다. 다시 로그인해주세요.",
      },
      { status: 401 },
    );
  }

  if (!refreshResponse.ok) {
    return Response.json(
      {
        code: "REFRESH_ERROR",
        message: "토큰 갱신 중 오류가 발생했습니다.",
      },
      { status: refreshResponse.status },
    );
  }

  const refreshedTokens =
    (await refreshResponse.json()) as RefreshTokenResponse;

  // 새 토큰을 HttpOnly 쿠키에 저장
  setRefreshedAuthCookies(cookieStore, refreshedTokens);

  // 새 AT로 원래 요청을 한 번 재시도
  return requestWithToken(refreshedTokens.accessToken);
}