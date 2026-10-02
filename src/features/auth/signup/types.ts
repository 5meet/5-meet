// 회원가입 요청
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// 회원가입 응답
export interface SignupResponse {
  teamId: string;
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  companyName: string | null;
  image: string | null;
}

// 이메일 중복 체크 요청
export interface EmailCheckRequest {
  email: string;
}

// 이메일 중복 체크 응답
export interface EmailCheckResponse {
  available: boolean;
}
