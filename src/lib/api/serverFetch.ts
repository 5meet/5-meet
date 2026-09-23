import { cookies } from "next/headers";

import { ApiErrorResponse } from "./type";
import { ApiError } from "./ApiError";

interface FetchOptions extends RequestInit {
  timeout?: number; // 기본 타임아웃 지원 (ms)
  auth?: boolean; // 인증이 필요한 사이트인 경우 true로 전달
}

export async function serverFetch<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const {
    timeout = 10000,
    auth = false,
    signal: externalSignal, // 외부에서 전달해준 시그널
    ...fetchOptions
  } = options;

  // 기본 timeout용 signal
  const timeoutSignal = AbortSignal.timeout(timeout);

  const signal = externalSignal
    ? AbortSignal.any([externalSignal, timeoutSignal])
    : timeoutSignal;

  try {
    const requestHeaders = new Headers(fetchOptions.headers);

    // 외부에서 Authorization을 직접 전달하지 않은 경우에만
    // Cookie의 Access Token을 사용
    if (auth && !requestHeaders.has("Authorization")) {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get("accessToken")?.value;

      if (accessToken) {
        requestHeaders.set("Authorization", `Bearer ${accessToken}`);
      }
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
      signal,
    });

    // 1. 서버 HTTP 에러 (4xx, 5xx)
    if (!response.ok) {
      const errorData = (await response.json()) as ApiErrorResponse;

      throw new ApiError(
        errorData.message,
        errorData.code,
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    // 2. !response.ok에서 생성한 ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // 3. 타임아웃
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ApiError(
        "요청 시간이 초과되었습니다. 다시 시도해주세요.",
        "TIMEOUT_ERROR",
      );
    }

    // 4. 외부 AbortSignal에 의한 요청 취소
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        "요청이 취소되었습니다.",
        "ABORT_ERROR",
      );
    }

    // 5. 네트워크 에러
    if (error instanceof TypeError) {
      throw new ApiError(
        "네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.",
        "NETWORK_ERROR",
      );
    }

    // 6. 예상하지 못한 에러
    throw new ApiError(
      "알 수 없는 오류가 발생했습니다.",
      "UNKNOWN_ERROR",
    );
  }
}