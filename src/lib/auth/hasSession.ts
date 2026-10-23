// 토큰을 가지고있는지 확인하는 함수

import { cookies } from "next/headers";

export async function hasSession() {
  const cookieStore = await cookies();
  return cookieStore.has("accessToken") || cookieStore.has("refreshToken");
}