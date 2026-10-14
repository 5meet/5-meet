"use server";

import { cookies } from "next/headers";

import { serverFetch } from "@/lib/api/serverFetch";
import { ApiError } from "@/lib/api/ApiError";

import type { LoginRequest, LoginResponse } from "@/features/auth/type";
import { setAuthCookies } from '@/lib/auth/authCookies';

// 백엔드에서 받은 결과를 그대로 전달하는게 아닌 성공여부, message, 유저정보만 담아서 클라이언트에 전달
interface LoginActionResult {
  success: boolean;
  message?: string;
  user?: LoginResponse["user"];
}

export async function loginAction(
  data: LoginRequest,
): Promise<LoginActionResult> {
  try {
    const result = await serverFetch<LoginResponse>(
      `/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const cookieStore = await cookies();
    setAuthCookies(cookieStore, result);
    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "로그인 중 오류가 발생했습니다.",
    };
  }
}
