// 토큰이 만료되었는지 확인하는 함수입니다.

interface JwtPayload {
  exp?: number;
}

export function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split(".")[1];

    if (!payloadBase64) {
      return true;
    }

    const decodedJson = Buffer.from(
      payloadBase64,
      "base64url",
    ).toString("utf-8");

    const payload = JSON.parse(decodedJson) as JwtPayload;

    if (typeof payload.exp !== "number") {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const bufferSeconds = 30;

    return payload.exp <= currentTime + bufferSeconds;
  } catch {
    return true;
  }
}