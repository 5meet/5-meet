export function refreshToken(currentRefreshToken: string) {
  return fetch(`${process.env.NEXT_PUBLIC_CODEIT_API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: currentRefreshToken,
    }),
    cache: "no-store",
  });
}
