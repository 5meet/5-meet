import Image from "next/image";

import { EmptyState } from "@/components/ui/EmptyState/EmptyState"; 
import { MeetingCard } from "@/components/ui/MeetingCard/MeetingCard";
import { favorites } from "@/data/favorites";

export function FavoriteList() {
  if (favorites.length === 0) {
    return <EmptyState message="아직 찜한 모임이 없어요" />;
    }
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {favorites.map((meeting) => (
        <MeetingCard key={meeting.id} {...meeting} />
      ))}
    </div>
  );
}