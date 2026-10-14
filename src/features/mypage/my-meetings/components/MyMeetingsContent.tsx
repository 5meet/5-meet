"use client";

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

function toSummary(meeting: JoinedMeeting): MyMeetingSummary {
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
  };
}

export default function MyMeetingsContent() {
  const query = useJoinedMeetingsQuery();

  if (query.isPending) return <MyMeetingsView status="loading" />;
  if (query.isError) {
    return <MyMeetingsView status="error" onRetry={() => void query.refetch()} />;
  }

  const meetings = query.data.pages.flatMap((page) => page.data).map(toSummary);
  return (
    <>
      <MyMeetingsView status="success" meetings={meetings} />
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
