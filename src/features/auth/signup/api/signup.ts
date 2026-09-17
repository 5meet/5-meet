import { api } from "@/lib/api/api";
import type { SignupRequest, SignupResponse } from "../types";

// signup 함수에서는 순수하게 통신만하고 에러처리 X
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  return await api
    .post("/auth/signup", {
      json: data,
    })
    .json<SignupResponse>();
};