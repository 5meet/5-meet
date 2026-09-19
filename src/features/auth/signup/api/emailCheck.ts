import { api } from "@/lib/api/api";
import type { EmailCheckRequest, EmailCheckResponse } from "../types";

export const checkEmail = async (data: EmailCheckRequest) => {
  const response = await api
    .post("/auth/email-check", { json: data })
    .json<EmailCheckResponse>();
  return response;
};
