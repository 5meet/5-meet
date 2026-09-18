import type { MeetingCardProps } from "@/components/ui/MeetingCard/MeetingCard";
import type { Meeting } from "../api/types";

export const FALLBACK_MEETING_IMAGE = "/meetings-hero.jpg";

export function mapMeetingToCard(meeting: Meeting): MeetingCardProps {
  return {
    imageUrl: meeting.image || FALLBACK_MEETING_IMAGE,
    title: meeting.name,
    location: meeting.region || meeting.address || "장소 미정",
    category: meeting.type,
    dateTime: meeting.dateTime,
    registrationEnd: meeting.registrationEnd,
    participantCount: meeting.participantCount,
    capacity: meeting.capacity,
    isConfirmed: Boolean(meeting.confirmedAt),
  };
}

export function meetingDetailPath(meetingId: number): string {
  return `/meetings/${meetingId}`;
}
