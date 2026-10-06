import { ApiError } from "@/lib/api/ApiError";
import { serverFetch } from "@/lib/api/serverFetch";

import type { User } from "@/features/auth/type";

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await serverFetch<User>("/users/me", {
      auth: true,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    throw error;
  }
}