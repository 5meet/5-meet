import type { UpdateProfileRequest } from "../api/updateProfile";

const PROFILE_IMAGE_HOSTNAME = "sprint-fe-project.s3.ap-northeast-2.amazonaws.com";

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

function validateProfileName(value: unknown): ValidationResult<string> {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 20) {
    return { success: false, message: "이름은 1자 이상 20자 이하로 입력해주세요." };
  }

  return { success: true, data: value.trim() };
}

function validateProfileImage(value: unknown): ValidationResult<string> {
  try {
    if (typeof value !== "string") throw new Error();
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password
      || url.hostname !== PROFILE_IMAGE_HOSTNAME || url.port) throw new Error();

    return { success: true, data: url.href };
  } catch {
    return { success: false, message: "올바른 이미지 URL이 필요합니다." };
  }
}

export function validateProfileUpdate(body: unknown): ValidationResult<UpdateProfileRequest> {
  if (!body || typeof body !== "object" || Array.isArray(body)
    || Object.keys(body).length === 0
    || Object.keys(body).some((key) => key !== "name" && key !== "image")) {
    return { success: false, message: "올바른 프로필 정보를 입력해주세요." };
  }

  const payload: UpdateProfileRequest = {};

  if ("name" in body) {
    const name = validateProfileName(body.name);
    if (!name.success) return name;
    payload.name = name.data;
  }

  if ("image" in body) {
    const image = validateProfileImage(body.image);
    if (!image.success) return image;
    payload.image = image.data;
  }

  return { success: true, data: payload };
}
