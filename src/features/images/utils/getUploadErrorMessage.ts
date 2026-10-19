import { HTTPError } from "ky";

const readErrorInfo = (error: unknown) => {
  if (error instanceof HTTPError) {
    const data = error.data as { code?: string } | undefined;
    return { status: error.response.status, code: data?.code };
  }
  const e = error as { status?: number; code?: string };
  return { status: e.status, code: e.code };
};

export const getUploadErrorMessage = (error: unknown): string => {
  const { status, code } = readErrorInfo(error);

  if (code === "INVALID_FILE_TYPE") return "지원하지 않는 파일 형식입니다.";
  if (status === 401)
    return "로그인이 필요하거나 만료되었습니다. 다시 로그인해주세요.";
  return "이미지 업로드에 실패했습니다. 다시 시도해주세요.";
};
