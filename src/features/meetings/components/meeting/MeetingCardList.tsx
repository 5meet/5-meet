import { serverFetch } from "@/lib/api/serverFetch";
import { EmptyState } from "../EmptyState";
import type { MeetingsResponse } from "../../types/meeting";

import { MeetingCard } from "./MeetingCard";

interface MeetingCardListProps {
  endpoint: string;
}

export async function MeetingCardList({ endpoint }: MeetingCardListProps) {
  const response = await serverFetch<MeetingsResponse>(endpoint);
  const meetings = response.data.slice(0, 4);

  if (meetings.length === 0) {
    return (
      <div className="px-8 md:px-6">
        <EmptyState
          title="모임이 없습니다"
          description="새로운 모임을 만들어보세요!"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto grid grid-cols-1 gap-8 px-8 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}
