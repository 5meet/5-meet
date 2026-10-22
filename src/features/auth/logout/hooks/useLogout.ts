"use client";

import { useQueryClient } from "@tanstack/react-query";

import { CURRENT_USER_QUERY_KEY } from "@/features/auth/hooks/useCurrentUser";
import { logoutAction } from "@/features/auth/logout/actions/logoutAction";

export function useLogout() {
  const queryClient = useQueryClient();

  const logout = async () => {
    await logoutAction();

    await queryClient.cancelQueries({
      queryKey: CURRENT_USER_QUERY_KEY,
      exact: true,
    });

    queryClient.removeQueries({
      queryKey: CURRENT_USER_QUERY_KEY,
      exact: true,
    });
  };

  return { logout };
}