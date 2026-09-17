import { HTTPError } from "ky";
import type { ApiErrorResponse } from "./type";

export const getApiError = (error: unknown): ApiErrorResponse => {
  if (error instanceof HTTPError) {
    const data = error.data as ApiErrorResponse | undefined;

    return {
      code: data?.code ?? "UNKNOWN_ERROR",
      message:
        data?.message ?? "서버 요청 중 오류가 발생했습니다.",
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "알 수 없는 오류가 발생했습니다.",
  };
};