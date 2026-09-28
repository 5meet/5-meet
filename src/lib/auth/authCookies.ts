import { AuthToken } from "./type";

export const AUTH_COOKIE = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15분
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7일

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...BASE_COOKIE_OPTIONS,
  maxAge: ACCESS_TOKEN_MAX_AGE,
} as const;

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...BASE_COOKIE_OPTIONS,
  maxAge: REFRESH_TOKEN_MAX_AGE,
} as const;

interface CookieWriter {
  set(
    name: string,
    value: string,
    options?: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: "lax";
      path: string;
      maxAge: number;
    },
  ): unknown;

  delete(name: string): unknown;
}

export function setAuthCookies(store: CookieWriter, tokens: AuthToken) {
  store.set(
    AUTH_COOKIE.ACCESS_TOKEN,
    tokens.accessToken,
    ACCESS_TOKEN_COOKIE_OPTIONS,
  );

  store.set(
    AUTH_COOKIE.REFRESH_TOKEN,
    tokens.refreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS,
  );
}

export function clearAuthCookies(store: CookieWriter) {
  store.delete(AUTH_COOKIE.ACCESS_TOKEN);
  store.delete(AUTH_COOKIE.REFRESH_TOKEN);
}