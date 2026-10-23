/**
 * Server Component에서 인증이 필요한 API를 호출할 때 사용합니다.
 *
 * API가 401을 반환하면 Server Component에서는 쿠키를 수정할 수 없으므로
 * 세션 갱신을 처리하는 /api/auth/refresh 경로로 이동합니다.
 */

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { ApiError } from "./ApiError";
import { serverFetch } from "./serverFetch";
import type { BaseFetchOptions } from "@/lib/auth/type";

export async function serverFetchForPage<T>(
  url: string,
  returnTo: string,
  options: BaseFetchOptions = {},
  publicFallback = false,
) {
  try {
    return await serverFetch<T>(url, { ...options, auth: true });
  } catch (error) {
    /**
     * 401이 아닌 에러는 여기서 처리하지 않고
     * 호출한 곳으로 그대로 전달합니다.
     */
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }

    if (publicFallback) {
      const store = await cookies();
      if (!store.get("refreshToken")?.value) {
        return serverFetch<T>(url, { ...options, auth: false });
      }
    }

    const params = new URLSearchParams({
      redirect: returnTo,
    });
    if (publicFallback) params.set("publicFallback", "1");
    redirect(`/api/auth/refresh?${params.toString()}`);
  }
}
