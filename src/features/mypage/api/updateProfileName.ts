import { ApiError } from "@/lib/api/ApiError";
import type { User } from "@/features/auth/type";

export async function updateProfileName(name: string): Promise<User> {
  let response: Response;
  try {
    response = await fetch("/api/mypage/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  } catch {
    throw new ApiError("연결이 불안정해요. 입력 내용은 유지되니 다시 시도해주세요.", "NETWORK_ERROR");
  }
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(data?.message || "이름을 저장하지 못했어요. 다시 시도해주세요.", "PROFILE_SAVE_ERROR", response.status);
  }
  return response.json() as Promise<User>;
}
