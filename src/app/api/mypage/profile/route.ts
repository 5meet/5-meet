import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/ApiError";
import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";
import type { User } from "@/features/auth/type";

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "올바른 프로필 정보를 입력해주세요." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)
    || Object.keys(body).length === 0 || Object.keys(body).some((key) => key !== "name" && key !== "image")) {
    return NextResponse.json({ message: "올바른 프로필 정보를 입력해주세요." }, { status: 400 });
  }
  const payload: { name?: string; image?: string } = {};
  if ("name" in body) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 20) {
      return NextResponse.json({ message: "이름은 1자 이상 20자 이하로 입력해주세요." }, { status: 400 });
    }
    payload.name = body.name.trim();
  }
  if ("image" in body) {
    let url: URL;
    try {
      if (typeof body.image !== "string") throw new Error();
      url = new URL(body.image);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error();
    } catch {
      return NextResponse.json({ message: "올바른 이미지 URL이 필요합니다." }, { status: 400 });
    }
    payload.image = url.href;
  }
  try {
    const user = await serverFetchWithTokenRefresh<User>("/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
