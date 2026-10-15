import type { AppError } from "@/lib/api/type";

export const getUploadErrorMessage = (error: Error) =>
  (error as AppError).code === "INVALID_FILE_TYPE"
    ? "지원하지 않는 파일 형식입니다."
    : error.message || "이미지 업로드에 실패했습니다. 다시 시도해주세요.";
