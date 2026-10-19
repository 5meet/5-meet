import { HTTPError } from "ky";

export const getUploadErrorMessage = (error: unknown): string => {
  if (error instanceof HTTPError) {
    const code = (error.data as { code?: string } | undefined)?.code;

    if (code === "INVALID_FILE_TYPE") return "지원하지 않는 파일 형식입니다.";
    if (error.response.status === 401)
      return "로그인이 만료되었습니다. 다시 로그인해주세요.";
  }
  return "이미지 업로드에 실패했습니다. 다시 시도해주세요.";
};
