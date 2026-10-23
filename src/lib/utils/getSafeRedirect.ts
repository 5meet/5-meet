export function getSafeRedirect(
  redirect: string | null | undefined,
  fallback = "/",
  origin?: string,
): string {
  if (!redirect) return fallback;

  // 내부 경로 형식만 허용
  if (!redirect.startsWith("/") || redirect.startsWith("//")) {
    return fallback;
  }

  try {
    if (!origin) {
      // origin이 없으면 안전한 내부 경로인지 보수적으로 검사
      if (
        redirect.includes("\\") ||
        /[\u0000-\u001F\u007F]/.test(redirect)
      ) {
        return fallback;
      }

      return redirect;
    }

    const baseUrl = new URL(origin);
    const targetUrl = new URL(redirect, baseUrl);

    // 최종 이동 주소가 우리 사이트인지 확인
    if (targetUrl.origin !== baseUrl.origin) {
      return fallback;
    }

    return `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
  } catch {
    return fallback;
  }
}