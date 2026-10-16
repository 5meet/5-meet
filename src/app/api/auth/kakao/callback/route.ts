import { NextRequest, NextResponse } from "next/server";

import {
  KAKAO_STATE_COOKIE,
  KAKAO_REDIRECT_COOKIE,
  setAuthCookies,
} from "@/lib/auth/authCookies";
import { socialLogin } from "@/features/auth/api/socialLogin";
import { getSafeRedirect } from "@/lib/utils/getSafeRedirect";

const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";

function createLoginErrorUrl(
  request: NextRequest,
  error: string,
  redirect: string,
) {
  const url = new URL("/login", request.url);

  url.searchParams.set("error", error);
  url.searchParams.set("redirect", redirect);

  return url;
}

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

  // 로그인 후 이동할 경로 복원 및 검증
  const redirect = getSafeRedirect(
    request.cookies.get(KAKAO_REDIRECT_COOKIE)?.value,
    "/meetings",
    request.nextUrl.origin,
  );

  // 임시 OAuth 쿠키 삭제
  const clearOAuthCookies = (response: NextResponse) => {
    response.cookies.delete(KAKAO_STATE_COOKIE);
    response.cookies.delete(KAKAO_REDIRECT_COOKIE);
    return response;
  };

  // 실패 시 오류 정보와 원래 목적지를 유지
  const redirectToLoginError = (error: string) => {
    const response = NextResponse.redirect(
      createLoginErrorUrl(request, error, redirect),
    );

    return clearOAuthCookies(response);
  };

  // 1. OAuth state 검증
  if (!queryState || !cookieState || queryState !== cookieState) {
    return redirectToLoginError("kakao_state");
  }

  // 2. 카카오 로그인 취소 및 인증 오류 확인
  const kakaoError = request.nextUrl.searchParams.get("error");

  if (kakaoError) {
    if (kakaoError === "access_denied") {
      return redirectToLoginError("kakao_cancel");
    }

    return redirectToLoginError("kakao_login");
  }

  // 3. Authorization Code 검증
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return redirectToLoginError("kakao_code");
  }

  try {
    // 4. 카카오 Access Token 발급
    const kakaoAccessToken = await exchangeKakaoToken(code);

    // 5. 백엔드 소셜 로그인
    const result = await socialLogin("kakao", kakaoAccessToken);

    // 6. 로그인 성공 후 원래 목적지로 이동
    const response = NextResponse.redirect(
      new URL(redirect, request.url),
    );

    setAuthCookies(response.cookies, result);

    return clearOAuthCookies(response);
  } catch (error) {
    console.error("카카오 로그인 실패", error);

    return redirectToLoginError("kakao_login");
  }
}
