/**
 * API 요청 실패 시 사용하는 공통 에러 클래스입니다.
 *
 * 기본 HTTP 상태 코드(status)와
 * 백엔드에서 전달하는 에러 코드(code)와 에러 메세지(message) 함께 관리합니다.
 *
 * @example
 * throw new ApiError(
 *   "이미 존재하는 이메일입니다.",
 *   409,
 *   "DUPLICATE_EMAIL",
 * );
 * 지금 당장은 사용하지 않고 나중에 status(404, 409) 숫자가 필요하면 그때 추가하기
 */
export class throwApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    // Error 클래스에 에러 메시지를 전달합니다.
    super(message);

    // 일반 Error와 구분할 수 있도록 에러 이름을 지정합니다.
    this.name = "ApiError";
  }
}