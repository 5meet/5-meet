import { useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { meetingKeys } from "@/features/meetingDetail/queryKeys";
import { joinedMeetingsQueryKeys } from "./useJoinedMeetingsQuery";
import type { JoinedMeetingsResponse } from "../types";
import type { MyMeetingActionLock } from "./useMyMeetingActionLock";

interface Options {
  actionLockRef: MyMeetingActionLock;
  refetch: () => Promise<{ isError: boolean }>;
  onError: (message: string) => void;
  onStarted: () => void;
}

export function useCancelJoinedMeeting({ actionLockRef, refetch, onError, onStarted }: Options) {
  const queryClient = useQueryClient();
  const [cancelPendingId, setCancelPendingId] = useState<number | null>(null);

  async function cancelMeeting(meeting: { id: number; canCancel?: boolean }) {
    if (
      !meeting.canCancel || actionLockRef.current.cancelPending ||
      actionLockRef.current.favoriteIds.size > 0
    ) return;
    actionLockRef.current.cancelPending = true;
    setCancelPendingId(meeting.id);
    onStarted();
    try {
      const response = await fetch(`/api/mypage/joined-meetings/${meeting.id}`, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? "예약을 취소하지 못했습니다.");
      }
      await queryClient.cancelQueries({ queryKey: joinedMeetingsQueryKeys.list() });
      queryClient.setQueryData<InfiniteData<JoinedMeetingsResponse>>(
        joinedMeetingsQueryKeys.list(),
        (old) => old && {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((item) => item.id !== meeting.id),
          })),
        },
      );
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      const refreshed = await refetch();
      if (refreshed.isError) {
        onError("예약은 취소되었지만 목록 갱신에 실패했습니다. 목록 다시 불러오기를 눌러주세요.");
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "예약 취소에 실패했습니다.");
    } finally {
      actionLockRef.current.cancelPending = false;
      setCancelPendingId(null);
    }
  }

  return { cancelMeeting, cancelPendingId };
}
