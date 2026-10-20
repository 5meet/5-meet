import { HTTPError } from "ky";

import { authApi } from "@/lib/api/authApi";

import type { User } from "@/features/auth/type";

// 로그인한 사용자 정보 조회
export async function getCurrentUserClient(): Promise<User | null> {
  try {
    return await authApi.get("users/me").json<User>();
  } catch (error) {
    // 비로그인 상태
    if (error instanceof HTTPError && error.response.status === 401) {
      return null;
    }

    // 그 외 오류는 React Query에 전달
    throw error;
  }
}