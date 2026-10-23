"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CURRENT_USER_QUERY_KEY } from "@/features/auth/hooks/useCurrentUser";
import type { User } from "@/features/auth/type";
import { useUploadImageMutation } from "@/features/images/hooks/useUploadImageMutation";
import { getUploadErrorMessage } from "@/features/images/utils/getUploadErrorMessage";
import { updateProfile, type UpdateProfileRequest } from "../api/updateProfile";

interface SaveProfileVariables {
  name: string;
  userId: number;
  imageFile?: File;
}

export function useUpdateProfile(userId: number | undefined) {
  const queryClient = useQueryClient();
  const uploadMutation = useUploadImageMutation();
  const pendingUserIds = useRef(new Set<number>());
  // Reuse the completed upload if only the profile PATCH failed.
  const uploadedImages = useRef(new WeakMap<File, { userId: number; url: string }>());

  const requireCurrentUser = (requestedUserId: number) => {
    const currentUser = queryClient.getQueryData<User | null>(CURRENT_USER_QUERY_KEY);
    if (currentUser?.id !== requestedUserId) {
      throw new Error("로그인 정보가 변경되었어요. 프로필을 다시 확인해주세요.");
    }
    return currentUser;
  };

  const mutation = useMutation({
    mutationFn: async ({ name, userId: requestedUserId, imageFile }: SaveProfileVariables) => {
      const currentUser = requireCurrentUser(requestedUserId);
      const payload: UpdateProfileRequest = {};
      if (name !== currentUser.name) payload.name = name;
      if (imageFile) {
        const uploaded = uploadedImages.current.get(imageFile);
        if (uploaded?.userId === requestedUserId) {
          payload.image = uploaded.url;
        } else {
          try {
            payload.image = await uploadMutation.mutateAsync({ file: imageFile, folder: "users" });
          } catch (error) {
            throw new Error(getUploadErrorMessage(error));
          }
          uploadedImages.current.set(imageFile, { userId: requestedUserId, url: payload.image });
        }
        // Uploads can outlive a login session; never PATCH a different account.
        requireCurrentUser(requestedUserId);
      }
      if (Object.keys(payload).length === 0) return currentUser;
      return updateProfile(payload);
    },
    retry: false,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
    onSuccess: async (user, { userId: requestedUserId }) => {
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

  const saveProfile = async (name: string, imageFile?: File) => {
    if (userId === undefined) {
      throw new Error("로그인 정보를 확인한 뒤 다시 시도해주세요.");
    }
    if (pendingUserIds.current.has(userId)) {
      throw new Error("프로필을 저장하고 있어요. 잠시 후 다시 시도해주세요.");
    }
    // Acquire synchronously so same-tick calls cannot bypass the lock.
    pendingUserIds.current.add(userId);
    await mutation.mutateAsync({ name: name.trim(), userId, imageFile });
  };
  return { saveProfile };
}
