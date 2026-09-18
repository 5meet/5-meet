"use client";

import { useRouter } from "next/navigation";
import { MeetingCard } from "@/components/ui/MeetingCard/MeetingCard";
import type { Meeting } from "../api/types";
import {
  mapMeetingToCard,
  meetingDetailPath,
} from "../lib/mapMeetingToCard";

type MeetingListProps = {
  meetings: Meeting[];
};

export function MeetingList({ meetings }: MeetingListProps) {
  const router = useRouter();

  return (
    <ul className="flex flex-col gap-4">
      {meetings.map((meeting) => {
        const card = mapMeetingToCard(meeting);
        const href = meetingDetailPath(meeting.id);
        return (
          <li key={meeting.id}>
            <MeetingCard
              {...card}
              onParticipateClick={() => router.push(href)}
              onFavoriteClick={() => {
                // TODO: E 파트 찜 훅 연결
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
