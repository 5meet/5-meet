"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import MyMeetingsView, { type MyMeetingSummary } from "./MyMeetingsView";
import { useJoinedMeetingsQuery } from "../hooks/useJoinedMeetingsQuery";
import type { JoinedMeeting } from "../types";

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
    dateLabel: isValid ? dateFormatter.format(date) : "일정 미정",
    timeLabel: isValid ? timeFormatter.format(date) : "",
    participantCount: meeting.participantCount,
    capacity: meeting.capacity,
    isCompleted: meeting.isCompleted,
    isConfirmed: Boolean(meeting.confirmedAt),
    isCanceled: Boolean(meeting.canceledAt),
    canCancel: userId !== undefined && meeting.hostId !== userId && !meeting.canceledAt && !meeting.isCompleted && Boolean(date && date.getTime() > Date.now()),
  };
}

export default function MyMeetingsContent() {
  const query = useJoinedMeetingsQuery();
  const [cancelPendingId, setCancelPendingId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const currentUser = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<{ id: number }> => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) throw new Error("사용자 정보를 불러오지 못했습니다.");
      return (await response.json()) as { id: number };
    },
  });

  async function cancelMeeting(meeting: MyMeetingSummary) {
    if (!meeting.canCancel || cancelPendingId !== null) return;
    if (!window.confirm(`‘${meeting.name}’ 예약을 취소하시겠습니까?`)) return;

    setCancelPendingId(meeting.id);
    setCancelError(null);
    try {
      const response = await fetch(`/api/mypage/joined-meetings/${meeting.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message ?? "예약을 취소하지 못했습니다.");
      }
      await query.refetch();
    } catch (error) {
      setCancelError(error instanceof Error ? error.message : "예약 취소에 실패했습니다.");
    } finally {
      setCancelPendingId(null);
    }
  }

  if (query.isPending) return <MyMeetingsView status="loading" />;
  if (query.isError) {
    return <MyMeetingsView status="error" onRetry={() => void query.refetch()} />;
  }

  const meetings = query.data.pages.flatMap((page) => page.data).map((meeting) => toSummary(meeting, currentUser.data?.id));
  return (
    <>
      {cancelError && <p role="alert" className="mb-4 text-sm text-red-600">{cancelError}</p>}
      <MyMeetingsView status="success" meetings={meetings} onCancel={(meeting) => void cancelMeeting(meeting)} cancelPendingId={cancelPendingId} />
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
