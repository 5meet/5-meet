import type { User } from "@/features/auth/type";

// 유저 정보 요청 api
export async function getCurrentUserClient(): Promise<User | null> {
  const response = await fetch("/api/auth/me");

  // 비로그인 상태
  if (response.status === 401) {
    return null;
  }

  // 그 외 API 오류
  if (!response.ok) {
    throw new Error("사용자 정보를 불러오지 못했습니다.");
  }

  return (await response.json()) as User;
}