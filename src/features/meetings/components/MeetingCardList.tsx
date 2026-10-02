import type { Meeting } from "../types/meeting";
import { MeetingCard } from "./MeetingCard";

interface MeetingCardListProps {
  meetings: Meeting[];
}

export function MeetingCardList({ meetings }: MeetingCardListProps) {
  return (
    <div className="mx-auto grid grid-cols-1 gap-8 px-8 sm:grid-cols-2 lg:grid-cols-4 md:px-6">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}