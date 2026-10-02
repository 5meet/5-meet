import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Heart, MapPin, Users } from "lucide-react";

import type { Meeting } from "../types/meeting";

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const {
    id,
    name,
    image,
    type,
    region,
    dateTime,
    capacity,
    participantCount,
  } = meeting;

  const date = new Date(dateTime);

  const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;

  const formattedTime = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const isFull = participantCount >= capacity;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* 이미지 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            이미지 없음
          </div>
        )}

        {/* 상태 배지 */}
        <span
          className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isFull
              ? "bg-blue-50 text-blue-500"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {isFull ? "모집 마감" : "참여 가능"}
        </span>

        {/* 이미지 위 찜 */}
        <button
          type="button"
          aria-label={`${name} 찜하기`}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/30"
        >
          <Heart className="size-5" />
        </button>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <h3 className="truncate text-base font-semibold text-gray-900">
          {name}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-sm text-gray-400">
          <MapPin className="size-3.5" />
          <span>
            {type} · {region}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <CalendarDays className="size-4" />

            <span>{formattedDate}</span>

            <span className="font-semibold text-emerald-500">
              {formattedTime}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <Users className="size-4" />

            <span className="font-medium text-emerald-500">
              {participantCount}/{capacity}
            </span>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            aria-label={`${name} 찜하기`}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:bg-gray-50"
          >
            <Heart className="size-5" />
          </button>

          {isFull ? (
            <button
              type="button"
              disabled
              className="h-10 flex-1 rounded-full bg-gray-300 text-sm font-semibold text-white"
            >
              마감
            </button>
          ) : (
            <Link
              href={`/meetings/${id}`}
              className="flex h-10 flex-1 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              참여하기
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
