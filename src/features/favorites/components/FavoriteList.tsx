import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { MeetingCard } from "@/components/ui/MeetingCard/MeetingCard";
import type { FavoriteMeeting } from "../types";

interface FavoriteListProps {
  meetings: FavoriteMeeting[];
  onFavoriteClick: (meetingId: number) => void;
}

function formatDate(dateTime: string) {
  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatTime(dateTime: string) {
  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function FavoriteList({
  meetings,
  onFavoriteClick,
}: FavoriteListProps) {
  if (meetings.length === 0) {
    return (
      <EmptyState message="아직 찜한 모임이 없어요" />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {meetings.map((favorite) => {
        const { meeting } = favorite;

        return (
          <MeetingCard
            key={favorite.id}
            imageUrl={meeting.image}
            title={meeting.name}
            location={meeting.region}
            category={meeting.type}
            date={formatDate(meeting.dateTime)}
            time={formatTime(meeting.dateTime)}
            registrationEnd={
              meeting.registrationEnd
            }
            participantCount={
              meeting.participantCount
            }
            capacity={meeting.capacity}
            isFavorite={meeting.isFavorited}
            isConfirmed={Boolean(
              meeting.confirmedAt,
            )}
            onFavoriteClick={() =>
              onFavoriteClick(meeting.id)
            }
          />
        );
      })}
    </div>
  );
}