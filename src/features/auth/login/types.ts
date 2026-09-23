// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: number;
  teamId: string;
  email: string;
  name: string;
  companyName: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

// 로그인 응답
export interface LoginResponse {
  user: LoginUser;
  accessToken: string;
  refreshToken: string;
}