import { serverFetch } from "@/lib/api/serverFetch";
import type { LoginResponse, SocialProvider } from "@/features/auth/type";

export async function socialLogin(
  provider: SocialProvider,
  token: string,
): Promise<LoginResponse> {
  const response = await serverFetch<LoginResponse>(`/oauth/${provider}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  return response;
}
