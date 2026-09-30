// src/features/auth/signup/actions/signupAction.ts
"use server";

import { ApiError } from "@/lib/api/ApiError";
import { serverFetch } from "@/lib/api/serverFetch";

import type { SignupRequest, SignupResponse } from "../types";

interface SignupActionResult {
  success: boolean;
  message?: string;
}

export async function signupAction(
  data: SignupRequest,
): Promise<SignupActionResult> {
  try {
    await serverFetch<SignupResponse>("/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return {
      success: true,
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
      message: "회원가입 중 오류가 발생했습니다.",
    };
  }
}
