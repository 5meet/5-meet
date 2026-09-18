import ky, { HTTPError, TimeoutError } from "ky";
import { ApiErrorResponse } from "./type";

export const api = ky.create({
  prefix: process.env.NEXT_PUBLIC_CODEIT_API_URL,
  timeout: 10000,
  hooks: {
    beforeError: [
      ({ error }) => {
        // 1. 서버가 응답한 HTTPError인 경우
        if (error instanceof HTTPError) {
          const data = error.data as ApiErrorResponse | undefined;
          error.message = data?.message || "서버 요청 중 오류가 발생했습니다.";
          return error;
        }

        // 2. 타임아웃 에러인 경우
        if (error instanceof TimeoutError) {
          error.message = "요청 시간이 초과되었습니다. 다시 시도해주세요.";
          return error;
        }

        // 3. 네트워크 단절 / 일반 에러
        if (error instanceof Error) {
          error.message = "네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.";
          return error;
        }

        return error;
      },
    ],
  },
});