import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/ApiError";
import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";
import type { User } from "@/features/auth/type";
import { validateProfileUpdate } from "@/features/mypage/validators/profile";

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "올바른 프로필 정보를 입력해주세요." }, { status: 400 });
  }
  const validation = validateProfileUpdate(body);
  if (!validation.success) {
    return NextResponse.json({ message: validation.message }, { status: 400 });
  }
  try {
    const user = await serverFetchWithTokenRefresh<User>("/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });
    return NextResponse.json(user);
  } catch (error) {
    const status = error instanceof ApiError ? error.status ?? 500 : 500;
    const message = status === 401
      ? "로그인이 만료되었어요. 다시 로그인한 후 저장해주세요."
      : status === 400
        ? "프로필을 저장하지 못했어요. 입력 내용을 확인해주세요."
        : "프로필을 저장하지 못했어요. 잠시 후 다시 시도해주세요.";
    return NextResponse.json({ message }, { status });
  }
}
