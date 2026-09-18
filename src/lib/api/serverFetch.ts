import { ApiErrorResponse } from "./type";
import { ApiError } from "./ApiError"

interface FetchOptions extends RequestInit {
  timeout?: number; // 기본 타임아웃 지원 (ms)
}

export async function serverFetch<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      // AbortSignal.timeout으로 타임아웃 자동 제어
      signal: options.signal ?? AbortSignal.timeout(timeout),
    });

    // 1. 서버 HTTP 에러 (4xx, 5xx)
    if (!response.ok) {
      const errorData = (await response.json()) as ApiErrorResponse;

      throw new ApiError(errorData.message, errorData.code, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    // 2. !response.ok에서 생성한 apiError 처리
    if (error instanceof ApiError) {
      throw error;
    }
    // 3. 타입 아웃
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ApiError(
        "요청 시간이 초과되었습니다. 다시 시도해주세요",
        "TIMEOUT_ERROR",
      );
    }

    // 4. 네트워크 에러
    if (error instanceof TypeError) {
      throw new ApiError(
        "네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.",
        "NETWORK_ERROR",
      );
    }

    // 5. 예상하지 못한 에러
    throw new ApiError("알 수 없는 오류가 발생했습니다.", "UNKNOWN_ERROR");
  }
}
