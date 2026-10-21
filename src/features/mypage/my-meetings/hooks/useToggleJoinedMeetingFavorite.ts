import { useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { meetingKeys } from "@/lib/queryKeys";
import { joinedMeetingsQueryKeys } from "./useJoinedMeetingsQuery";
import type { JoinedMeetingsResponse } from "../types";
import type { MyMeetingActionLock } from "./useMyMeetingActionLock";

interface Options {
  actionLockRef: MyMeetingActionLock;
  refetch: () => Promise<unknown>;
  onError: (message: string) => void;
}

export function useToggleJoinedMeetingFavorite({
  actionLockRef,
  refetch,
  onError,
}: Options) {
  const queryClient = useQueryClient();
  const [favoritePendingId, setFavoritePendingId] = useState<number | null>(
    null,
  );

  async function toggleFavorite(meeting: {
    id: number;
    isFavorited?: boolean;
  }) {
    if (actionLockRef.current !== null) return;
    actionLockRef.current = "favorite";
    setFavoritePendingId(meeting.id);
    try {
      const response = await fetch(
        `/api/mypage/joined-meetings/${meeting.id}/favorite`,
        {
          method: meeting.isFavorited ? "DELETE" : "POST",
        },
      );
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? "찜 상태를 변경하지 못했습니다.");
      }
      await queryClient.cancelQueries({
        queryKey: joinedMeetingsQueryKeys.list(),
      });
      queryClient.setQueryData<InfiniteData<JoinedMeetingsResponse>>(
        joinedMeetingsQueryKeys.list(),
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((item) =>
                item.id === meeting.id
                  ? { ...item, isFavorited: !meeting.isFavorited }
                  : item,
              ),
            })),
          },
      );
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "찜 상태를 변경하지 못했습니다.",
      );
      // A conflict may mean another screen changed the server state.
      void refetch();
    } finally {
      actionLockRef.current = null;
      setFavoritePendingId(null);
    }
  }

  return { toggleFavorite, favoritePendingId };
}
