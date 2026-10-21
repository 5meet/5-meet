"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CURRENT_USER_QUERY_KEY } from "@/features/auth/hooks/useCurrentUser";
import type { User } from "@/features/auth/type";
import { updateProfileName } from "../api/updateProfileName";

interface SaveNameVariables {
  name: string;
  userId: number;
}

export function useUpdateProfileName(userId: number | undefined) {
  const queryClient = useQueryClient();
  const pendingUserIds = useRef(new Set<number>());
  const mutation = useMutation({
    mutationFn: ({ name }: SaveNameVariables) => updateProfileName(name),
    retry: false,
    onMutate: async () => {
      // Stop an older GET from overwriting the PATCH response.
      await queryClient.cancelQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
    onSuccess: async (user, { userId: requestedUserId }) => {
      // Use the request's identity even if the active account has changed.
      const currentUser = queryClient.getQueryData<User | null>(CURRENT_USER_QUERY_KEY);
      if (user.id !== requestedUserId || currentUser?.id !== requestedUserId) return;
      await queryClient.cancelQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      queryClient.setQueryData<User | null>(CURRENT_USER_QUERY_KEY, (current) =>
        current?.id === requestedUserId && user.id === requestedUserId ? user : current,
      );
    },
    onSettled: (_data, _error, { userId: requestedUserId }) => {
      pendingUserIds.current.delete(requestedUserId);
    },
  });

  const saveName = async (name: string) => {
    if (userId === undefined) {
      throw new Error("로그인 정보를 확인한 뒤 다시 시도해주세요.");
    }
    if (pendingUserIds.current.has(userId)) {
      throw new Error("이름을 저장하고 있어요. 잠시 후 다시 시도해주세요.");
    }
    // Acquire synchronously: onMutate runs after an asynchronous boundary.
    pendingUserIds.current.add(userId);
    await mutation.mutateAsync({ name, userId });
  };
  return { saveName };
}
