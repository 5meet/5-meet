import { NextRequest, NextResponse } from "next/server";

import {
  KAKAO_STATE_COOKIE,
  KAKAO_REDIRECT_COOKIE,
  setAuthCookies,
} from "@/lib/auth/authCookies";
import { socialLogin } from "@/features/auth/api/socialLogin";
import { getSafeRedirect } from "@/lib/utils/getSafeRedirect";

const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

async function exchangeKakaoToken(code: string) {
  const restApiKey = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;

  if (!restApiKey || !redirectUri || !clientSecret) {
    throw new Error("카카오 환경변수가 설정되지 않았습니다.");
  }

  const body = new URLSearchParams();

  body.set("grant_type", "authorization_code");
  body.set("client_id", restApiKey);
  body.set("redirect_uri", redirectUri);
  body.set("code", code);
  body.set("client_secret", clientSecret);

  const response = await fetch(KAKAO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.text();

    console.error("카카오 토큰 발급 실패:", {
      status: response.status,
      error: errorData,
    });

    throw new Error("카카오 Access Token 발급에 실패했습니다.");
  }

  const data: KakaoTokenResponse = await response.json();

  if (!data.access_token) {
    throw new Error("카카오 Access Token이 없습니다.");
  }

  return data.access_token;
}

export async function GET(request: NextRequest) {
  const queryState = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get(KAKAO_STATE_COOKIE)?.value;

  // 추가: 로그인 성공 후 이동할 경로 복원
  const redirect = getSafeRedirect(
    request.cookies.get(KAKAO_REDIRECT_COOKIE)?.value,
  );

  // 임시 OAuth 쿠키 삭제를 공통 처리
  const clearOAuthCookies = (response: NextResponse) => {
    response.cookies.delete(KAKAO_STATE_COOKIE);
    response.cookies.delete(KAKAO_REDIRECT_COOKIE);
    return response;
  };

  // state 검증 실패
  if (!queryState || !cookieState || queryState !== cookieState) {
    const response = NextResponse.redirect(
      new URL("/login?error=kakao_state", request.url),
    );

    return clearOAuthCookies(response);
  }

  const code = request.nextUrl.searchParams.get("code");

  // Authorization Code가 없는 경우
  if (!code) {
    const response = NextResponse.redirect(
      new URL("/login?error=kakao_code", request.url),
    );

    return clearOAuthCookies(response);
  }

  try {
    const kakaoAccessToken = await exchangeKakaoToken(code);

    const result = await socialLogin("kakao", kakaoAccessToken);

    // 변경: 고정 경로가 아닌 저장된 경로로 이동
    const response = NextResponse.redirect(
      new URL(redirect, request.url),
    );

    setAuthCookies(response.cookies, result);

    return clearOAuthCookies(response);
  } catch (error) {
    console.error("카카오 로그인 실패", error);

    const response = NextResponse.redirect(
      new URL("/login?error=kakao_login", request.url),
    );

    return clearOAuthCookies(response);
  }
}