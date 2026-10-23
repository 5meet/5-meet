import { serverFetchForPage } from "@/lib/api/serverFetchForPage";
import { EmptyState } from "../EmptyState";
import type { MeetingsResponse } from "../../types/meetings";

import { MeetingCard } from "./MeetingCard";

interface MeetingCardListProps {
  endpoint: string;
  className?: string;
}

export async function MeetingCardList({
  endpoint,
  className = "px-8 md:px-6",
}: MeetingCardListProps) {
  // 인증이 없어도 정상적으로 처리되는 요청
  const response = await serverFetchForPage<MeetingsResponse>(endpoint, "/meetings", {
    cache: "no-store",
  }, true);
  const meetings = response.data;
  

  if (meetings.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          title="모임이 없습니다"
          description="새로운 모임을 만들어보세요!"
        />
      </div>
    );
  }

  return (
    <div
      className={`mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}
