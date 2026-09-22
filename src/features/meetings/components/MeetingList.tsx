"use client";

import { useRouter } from "next/navigation";
import { MeetingCard } from "@/components/ui/MeetingCard/MeetingCard";
import type { MeetingCardVariant } from "@/components/ui/MeetingCard/MeetingCard";
import type { Meeting } from "../api/types";
import {
  mapMeetingToCard,
  meetingDetailPath,
} from "../lib/mapMeetingToCard";

type MeetingListProps = {
  meetings: Meeting[];
  variant?: MeetingCardVariant;
};

export function MeetingList({
  meetings,
  variant = "list",
}: MeetingListProps) {
  const router = useRouter();
  const grid = variant !== "list";

  return (
    <ul
      className={
        grid
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          : "flex flex-col gap-4"
      }
    >
      {meetings.map((meeting) => {
        const card = mapMeetingToCard(meeting);
        const href = meetingDetailPath(meeting.id);
        return (
          <li key={meeting.id} className="min-w-0">
            <MeetingCard
              {...card}
              variant={variant}
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
