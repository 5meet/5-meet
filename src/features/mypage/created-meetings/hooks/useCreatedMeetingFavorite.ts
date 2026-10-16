"use client";

import { useRef, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { meetingKeys } from "@/features/meetingDetail/queryKeys";
import { joinedMeetingsQueryKeys } from "../../my-meetings/hooks/useJoinedMeetingsQuery";
import { createdMeetingsQueryKeys } from "./useCreatedMeetingsQuery";
import type { CreatedMeeting, CreatedMeetingsResponse } from "../types";

export function useCreatedMeetingFavorite(onError: (message: string) => void) {
  const queryClient = useQueryClient();
  const requestPendingRef = useRef(false);
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function toggleFavorite(meeting: CreatedMeeting) {
    if (requestPendingRef.current) return;
    requestPendingRef.current = true;
    setPendingId(meeting.id);
    try {
      const response = await fetch(`/api/mypage/created-meetings/${meeting.id}/favorite`, {
        method: meeting.isFavorited ? "DELETE" : "POST",
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "찜 상태를 변경하지 못했습니다.");
      }
      await queryClient.cancelQueries({ queryKey: createdMeetingsQueryKeys.list() });
      queryClient.setQueryData<InfiniteData<CreatedMeetingsResponse>>(createdMeetingsQueryKeys.list(),
        (old) => old && {
          ...old,
          pages: old.pages.map((page) => ({ ...page,
            data: page.data.map((item) => item.id === meeting.id ? { ...item, isFavorited: !meeting.isFavorited } : item),
          })),
        },
      );
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      void queryClient.invalidateQueries({ queryKey: joinedMeetingsQueryKeys.all });
    } catch (error) {
      onError(error instanceof Error ? error.message : "찜 상태를 변경하지 못했습니다.");
      // Reconcile a conflict without dropping previously loaded pages.
      void queryClient.invalidateQueries({ queryKey: createdMeetingsQueryKeys.list() });
    } finally {
      requestPendingRef.current = false;
      setPendingId(null);
    }
  }

  return { toggleFavorite, pendingId };
}
