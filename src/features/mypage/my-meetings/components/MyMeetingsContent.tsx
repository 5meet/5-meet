"use client";

import { useRef, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

import MyMeetingsView, { type MyMeetingSummary } from "./MyMeetingsView";
import {
  joinedMeetingsQueryKeys,
  useJoinedMeetingsQuery,
} from "../hooks/useJoinedMeetingsQuery";
import type { JoinedMeeting, JoinedMeetingsResponse } from "../types";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "long",
  day: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function toSummary(meeting: JoinedMeeting, userId?: number): MyMeetingSummary {
  const date = meeting.dateTime ? new Date(meeting.dateTime) : null;
  const isValid = date && !Number.isNaN(date.getTime());
  return {
    id: meeting.id,
    name: meeting.name,
    region: meeting.region,
    category: meeting.type,
    imageUrl: meeting.image,
    dateLabel: isValid ? dateFormatter.format(date) : "일정 미정",
    timeLabel: isValid ? timeFormatter.format(date) : "",
    participantCount: meeting.participantCount,
    capacity: meeting.capacity,
    isCompleted: meeting.isCompleted,
    isConfirmed: Boolean(meeting.confirmedAt),
    isCanceled: Boolean(meeting.canceledAt),
    canCancel:
      userId !== undefined &&
      meeting.hostId !== userId &&
      !meeting.canceledAt &&
      !meeting.isCompleted &&
      Boolean(date && date.getTime() > Date.now()),
  };
}

export default function MyMeetingsContent() {
  const query = useJoinedMeetingsQuery();
  const queryClient = useQueryClient();
  const [cancelPendingId, setCancelPendingId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const currentUser = useCurrentUser();
  const cancelLock = useRef(false);

  async function cancelMeeting(meeting: MyMeetingSummary) {
    if (!meeting.canCancel || cancelLock.current) return;
    if (!window.confirm(`‘${meeting.name}’ 예약을 취소하시겠습니까?`)) return;

    cancelLock.current = true;
    setCancelPendingId(meeting.id);
    setCancelError(null);
    try {
      const response = await fetch(
        `/api/mypage/joined-meetings/${meeting.id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(error.message ?? "예약을 취소하지 못했습니다.");
      }
      queryClient.setQueryData<InfiniteData<JoinedMeetingsResponse>>(
        joinedMeetingsQueryKeys.list(),
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((item) => item.id !== meeting.id),
            })),
          },
      );
      const refreshed = await query.refetch();
      if (refreshed.isError) {
        setCancelError(
          "예약은 취소되었지만 목록 갱신에 실패했습니다. 다시 시도해 주세요.",
        );
      }
    } catch (error) {
      setCancelError(
        error instanceof Error ? error.message : "예약 취소에 실패했습니다.",
      );
    } finally {
      cancelLock.current = false;
      setCancelPendingId(null);
    }
  }

  if (query.isPending) return <MyMeetingsView status="loading" />;
  if (query.isError && !query.data) {
    return (
      <MyMeetingsView status="error" onRetry={() => void query.refetch()} />
    );
  }

  const meetings = query.data.pages
    .flatMap((page) => page.data)
    .map((meeting) => toSummary(meeting, currentUser.data?.id));
  return (
    <>
      {cancelError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {cancelError}
        </p>
      )}
      <MyMeetingsView
        status="success"
        meetings={meetings}
        onCancel={(meeting) => void cancelMeeting(meeting)}
        cancelPendingId={cancelPendingId}
      />
      {query.isRefetchError && !query.isFetchNextPageError && (
        <button
          type="button"
          className="mt-4 rounded-xl border border-gray-300 px-4 py-2 text-sm"
          onClick={() => void query.refetch()}
        >
          목록 다시 불러오기
        </button>
      )}
      {query.isFetchNextPageError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          추가 목록을 불러오지 못했습니다. 더 보기를 눌러 다시 시도해 주세요.
        </p>
      )}
      {query.hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => void query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 disabled:opacity-50"
          >
            {query.isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </button>
        </div>
      )}
    </>
  );
}
