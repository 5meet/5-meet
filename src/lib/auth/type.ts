
// 인증에 사용되는 Access Token과 Refresh Token 타입
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

// 토큰을 갱신할 때 사용할 타입(Grace Period 상황에서는 null 전달)
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string | null;
}

// fetch 기본 옵션에 timeout을 추가한 공통 요청 옵션 타입
export interface BaseFetchOptions extends  RequestInit {
  timeout?: number
}

// serverFetch에서 인증 여부를 설정할 수 있는 요청 옵션 타입
export interface ServerFetchOptions extends BaseFetchOptions {
  auth?: boolean
}