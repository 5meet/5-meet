import { HTTPError } from "ky";
import type { ApiErrorResponse } from "./type";

// 에러 헨들링이 아닌 마무리로 에러를 객체로 변환해서 modal에 띄우거나 화면에 보여주는 용도로 사용
// 이 코드는 현재 사용하지 않습니다. ky 요청 에러 처리는 api.ts파일에서 담당하고 추후에 서버 컴포넌트 에러 처리를 추가하면서 사용할 예정입니다.
export const getApiError = (error: unknown): ApiErrorResponse => {
  // 1. ky의 HTTP 요청 에러
  // 서버가 4xx, 5xx 응답을 반환했을 때
  // 서버가 보내준 code, message를 반환
  if (error instanceof HTTPError) {
    const data = error.data as ApiErrorResponse | undefined;

    return {
      code: data?.code ?? "UNKNOWN_ERROR",
      message:
        data?.message ?? "서버 요청 중 오류가 발생했습니다.",
    };
  }

  // 2. 일반 JavaScript Error
  // ky의 HTTPError는 아니지만 Error 객체가 발생했을 때
  // 해당 Error의 message를 반환
  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
    };
  }

  // 3. 어떤 종류인지 알 수 없는 에러
  // Error 객체조차 아닌 값이 throw된 경우
  // 공통 기본 에러를 반환
  return {
    code: "UNKNOWN_ERROR",
    message: "알 수 없는 오류가 발생했습니다.",
  };
};