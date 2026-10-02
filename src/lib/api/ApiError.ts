/**
 * API 요청 실패 시 사용하는 공통 에러 클래스입니다.
 *
 * @example
 * throw new ApiError(
 *   "이미 존재하는 이메일입니다.",
 *   "DUPLICATE_EMAIL",
 *   409,
 * );
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number, //네트워크 에러는 status가 없습니다.
  ) {
    // Error 클래스에 에러 메시지를 전달합니다.
    super(message);

    // 일반 Error와 구분할 수 있도록 에러 이름을 지정합니다.
    this.name = "ApiError";
  }
}