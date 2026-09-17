import Image from "next/image";

import { MeetingCard } from "@/components/ui/MeetingCard/MeetingCard";
import { favorites } from "@/data/favorites";

export function FavoriteList() {
  if (favorites.length === 0) {
    return (
      <section className="flex min-h-[515px] items-center justify-center rounded-[23px]">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative mb-4 h-[66px] w-[100px]">
            <Image
              src="/review_empty.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>

          <p className="text-[14px] font-medium text-[#a7aaad]">
            아직 찜한 모임이 없어요
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {favorites.map((meeting) => (
        <MeetingCard key={meeting.id} {...meeting} />
      ))}
    </div>
  );
}