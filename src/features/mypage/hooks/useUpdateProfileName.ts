"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CURRENT_USER_QUERY_KEY } from "@/features/auth/hooks/useCurrentUser";
import type { User } from "@/features/auth/type";
import { updateProfileName } from "../api/updateProfileName";

export function useUpdateProfileName(userId: number | undefined) {
  const queryClient = useQueryClient();
  const pendingUserIds = useRef(new Set<number>());
  const mutation = useMutation({ mutationFn: updateProfileName, retry: false });

  const saveName = async (name: string) => {
    if (userId === undefined) {
      throw new Error("로그인 정보를 확인한 뒤 다시 시도해주세요.");
    }
    if (pendingUserIds.current.has(userId)) {
      throw new Error("이름을 저장하고 있어요. 잠시 후 다시 시도해주세요.");
    }
    pendingUserIds.current.add(userId);
    try {
      // Stop an older GET from overwriting the PATCH response.
      await queryClient.cancelQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      const user = await mutation.mutateAsync(name);
      // A response from the previous account must not cancel the current account's GET.
      const currentUser = queryClient.getQueryData<User | null>(CURRENT_USER_QUERY_KEY);
      if (user.id !== userId || currentUser?.id !== userId) return;
      await queryClient.cancelQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      queryClient.setQueryData<User | null>(CURRENT_USER_QUERY_KEY, (current) =>
        current?.id === userId && user.id === userId ? user : current,
      );
    } finally {
      pendingUserIds.current.delete(userId);
    }
  };
  return { saveName };
}
