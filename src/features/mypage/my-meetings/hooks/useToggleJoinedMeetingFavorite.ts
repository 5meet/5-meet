import { useRef, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { meetingKeys } from "@/lib/queryKeys";
import { joinedMeetingsQueryKeys } from "./useJoinedMeetingsQuery";
import type { JoinedMeetingsResponse } from "../types";
import type { MyMeetingActionLock } from "./useMyMeetingActionLock";

interface Options {
  actionLockRef: MyMeetingActionLock;
  onError: (message: string) => void;
}

export function useToggleJoinedMeetingFavorite({ actionLockRef, onError }: Options) {
  const queryClient = useQueryClient();
  const reconcileAfterRequestsRef = useRef(false);
  const [favoritePendingIds, setFavoritePendingIds] = useState<ReadonlySet<number>>(() => new Set());

  async function toggleFavorite(meeting: { id: number; isFavorited?: boolean }) {
    const lock = actionLockRef.current;
    if (lock.cancelPending || lock.favoriteIds.has(meeting.id)) return;
    lock.favoriteIds.add(meeting.id);
    setFavoritePendingIds(new Set(lock.favoriteIds));
    try {
      // A new action must not be overwritten by an older reconciliation GET.
      await queryClient.cancelQueries({ queryKey: joinedMeetingsQueryKeys.list() });
      const response = await fetch(`/api/mypage/joined-meetings/${meeting.id}/favorite`, {
        method: meeting.isFavorited ? "DELETE" : "POST",
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? "찜 상태를 변경하지 못했습니다.");
      }
      await queryClient.cancelQueries({ queryKey: joinedMeetingsQueryKeys.list() });
      queryClient.setQueryData<InfiniteData<JoinedMeetingsResponse>>(
        joinedMeetingsQueryKeys.list(),
        (old) => old && {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((item) => item.id === meeting.id
              ? { ...item, isFavorited: !meeting.isFavorited }
              : item),
          })),
        },
      );
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } catch (error) {
      reconcileAfterRequestsRef.current = true;
      onError(error instanceof Error ? error.message : "찜 상태를 변경하지 못했습니다.");
    } finally {
      lock.favoriteIds.delete(meeting.id);
      setFavoritePendingIds(new Set(lock.favoriteIds));
      // Reconcile a conflict only after every in-flight card has settled.
      if (lock.favoriteIds.size === 0 && reconcileAfterRequestsRef.current) {
        reconcileAfterRequestsRef.current = false;
        void queryClient.invalidateQueries({ queryKey: joinedMeetingsQueryKeys.list() });
      }
    }
  }

  return { toggleFavorite, favoritePendingIds };
}
