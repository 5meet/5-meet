"use client";

import { MeetingCard } from "@/components/ui/MeetingCard/MeetingCard";
import type { Meeting } from "../api/types";

const FALLBACK_IMAGE = "/meetings-hero.jpg";

type MeetingListProps = {
  meetings: Meeting[];
};

export function MeetingList({ meetings }: MeetingListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {meetings.map((meeting) => (
        <li key={meeting.id}>
          <MeetingCard
            imageUrl={meeting.image || FALLBACK_IMAGE}
            title={meeting.name}
            location={meeting.region || meeting.address || "장소 미정"}
            category={meeting.type}
            dateTime={meeting.dateTime}
            registrationEnd={meeting.registrationEnd}
            participantCount={meeting.participantCount}
            capacity={meeting.capacity}
            isConfirmed={Boolean(meeting.confirmedAt)}
          />
        </li>
      ))}
    </ul>
  );
}
