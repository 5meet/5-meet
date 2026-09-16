export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  companyName: string | null;
  image: string | null;
}