"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CURRENT_USER_QUERY_KEY } from "@/features/auth/hooks/useCurrentUser";
import type { User } from "@/features/auth/type";
import { updateProfileName } from "../api/updateProfileName";

export function useUpdateProfileName(userId: number | undefined) {
  const queryClient = useQueryClient();
  const requestInFlight = useRef(false);
  const mutation = useMutation({ mutationFn: updateProfileName, retry: false });

  const saveName = async (name: string) => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    try {
      // Stop an older GET from overwriting the PATCH response.
      await queryClient.cancelQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      const user = await mutation.mutateAsync(name);
      await queryClient.cancelQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      queryClient.setQueryData<User | null>(CURRENT_USER_QUERY_KEY, (current) =>
        current?.id === userId && user.id === userId ? user : current,
      );
    } finally {
      requestInFlight.current = false;
    }
  };
  return { saveName };
}
