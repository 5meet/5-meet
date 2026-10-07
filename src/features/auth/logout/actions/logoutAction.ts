"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { serverFetch } from "@/lib/api/serverFetch";
import {
  AUTH_COOKIE,
  clearAuthCookies,
} from "@/lib/auth/authCookies";

export async function logoutAction() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get(
    AUTH_COOKIE.REFRESH_TOKEN,
  )?.value;

  try {
    if (refreshToken) {
      await serverFetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });
    }
  } catch (error) {
    console.error("로그아웃 API 요청 실패:", error);
  }

  // 로그아웃 API 성공 여부와 관계없이 로컬 쿠키 제거
  clearAuthCookies(cookieStore);

  // redirect는 try/catch/finally 바깥에서
  redirect("/meetings");
}