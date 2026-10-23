// 사용자가 카카오 로그인 버튼을 누르면 로그인 페이지로 이동하는 route handler

import {
  KAKAO_STATE_COOKIE,
  KAKAO_STATE_COOKIE_OPTIONS,
  KAKAO_REDIRECT_COOKIE,
} from "@/lib/auth/authCookies";
import { NextResponse, NextRequest } from "next/server";
import { getSafeRedirect } from "@/lib/utils/getSafeRedirect";

const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";

export async function GET(request: NextRequest) {
  const restApiKey = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;
  const state = crypto.randomUUID();

  const redirect = getSafeRedirect(
    request.nextUrl.searchParams.get("redirect"),
    "/meetings", //redirect가 없다면 이동할 기본 주소
    request.nextUrl.origin
  );
  if (!restApiKey) {
    throw new Error("KAKAO_REST_API_KEY가 설정되지 않았습니다.");
  }
  if (!redirectUri) {
    throw new Error("KAKAO_REDIRECT_URI가 설정되지 않았습니다.");
  }
  const url = new URL(KAKAO_AUTH_URL);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", restApiKey);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);

  // state 생성
  // url에서 state, cookie에서 state를 전달해서 Callback route 에서 같은지 비교(공격자가 url을 통해 state를 임의로 변경하는것을 방지)
  response.cookies.set(KAKAO_STATE_COOKIE, state, KAKAO_STATE_COOKIE_OPTIONS);

  // redirect할 주소 저장
  response.cookies.set(
    KAKAO_REDIRECT_COOKIE,
    redirect,
    KAKAO_STATE_COOKIE_OPTIONS,
  );

  return response;
}
