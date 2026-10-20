
import { serverFetch } from "@/lib/api/serverFetch";
import { EmptyState } from "../EmptyState";
import type { MeetingsResponse } from "../../types/meeting";

import { MeetingCard } from "./MeetingCard";

interface MeetingCardListProps {
  endpoint: string;
  className?: string;
}

export async function MeetingCardList({
  endpoint,
  className = "px-8 md:px-6",
}: MeetingCardListProps) {
  const response = await serverFetch<MeetingsResponse>(endpoint);
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
