// 공통 유저 타입
export interface User {
  id: number;
  teamId: string;
  email: string;
  name: string;
  companyName: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

// 회원가입 요청
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// 회원가입 응답
export type SignupResponse = User;

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// 이메일 중복 체크 요청
export interface EmailCheckRequest {
  email: string;
}

// 이메일 중복 체크 응답
export interface EmailCheckResponse {
  available: boolean;
}

// 소셜 로그인 
export type SocialProvider = "kakao" | "google";