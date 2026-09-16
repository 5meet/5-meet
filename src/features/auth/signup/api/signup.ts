import { api } from "@/lib/api/api";
import { getApiError } from "@/lib/api/getApiError";
import type { SignupRequest, SignupResponse } from "../types";

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await api
      .post("auth/signup", {
        json: data,
      })
      .json<SignupResponse>();
    console.log("회원가입 성공 응답:", response);
    return response;
  } catch (error) {
    const apiError = getApiError(error);
    console.log("signup.ts 에러", apiError);
    throw apiError;
  }
};
