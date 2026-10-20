"use client";

import { useRef, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { meetingKeys } from "@/features/meetingDetail/queryKeys";
import { joinedMeetingsQueryKeys } from "../../my-meetings/hooks/useJoinedMeetingsQuery";
import { createdMeetingsQueryKeys } from "./useCreatedMeetingsQuery";
import type { CreatedMeeting, CreatedMeetingsResponse } from "../types";

export function useCreatedMeetingFavorite(onError: (message: string) => void) {
  const queryClient = useQueryClient();
  const pendingIdsRef = useRef(new Set<number>());
  const reconcileAfterRequestsRef = useRef(false);
  const [pendingIds, setPendingIds] = useState<ReadonlySet<number>>(() => new Set());

  async function toggleFavorite(meeting: CreatedMeeting) {
    if (pendingIdsRef.current.has(meeting.id)) return;
    pendingIdsRef.current.add(meeting.id);
    setPendingIds(new Set(pendingIdsRef.current));
    try {
      await queryClient.cancelQueries({ queryKey: createdMeetingsQueryKeys.list() });
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
      reconcileAfterRequestsRef.current = true;
      onError(error instanceof Error ? error.message : "찜 상태를 변경하지 못했습니다.");
    } finally {
      pendingIdsRef.current.delete(meeting.id);
      setPendingIds(new Set(pendingIdsRef.current));
      // Wait for other cards before reconciling a failed request, so a refetch
      // cannot overwrite another card's pending update with older server data.
      if (pendingIdsRef.current.size === 0 && reconcileAfterRequestsRef.current) {
        reconcileAfterRequestsRef.current = false;
        void queryClient.invalidateQueries({ queryKey: createdMeetingsQueryKeys.list() });
      }
    }
  }

  return { toggleFavorite, pendingIds };
}
