"use server";

import { cookies } from "next/headers";
import { socialLogin } from "@/features/auth/api/socialLogin";
import { setAuthCookies } from "@/lib/auth/authCookies";
import { ApiError } from "@/lib/api/ApiError";

import type { LoginResponse } from "@/features/auth/type";

type SocialProvider = "kakao" | "google";

interface SocialLoginActionResult {
  success: boolean;
  message?: string;
  user?: LoginResponse["user"];
}

export async function socialLoginAction(
  provider: SocialProvider,
  token: string,
): Promise<SocialLoginActionResult> {
  try {
    const result = await socialLogin(provider, token);
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
      message: "소셜 로그인 중 오류가 발생했습니다.",
    };
  }
}
