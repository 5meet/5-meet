"use client";

import Image from "next/image";
import { Hand, MapPin } from "lucide-react";

import { Button } from "@/components/ui/Button/Button";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";
import Tags from "@/components/ui/Tags/Tags";
import MeetingProgressBar from "@/components/ui/ProgressBar/MeetingProgressBar";
import formatRegistrationEnd from "@/lib/date/formatRegistrationEnd";

export interface MeetingCardProps {
  imageUrl: string;
  title: string;
  location: string;
  category: string;
  dateTime: string;
  registrationEnd: string;
  participantCount: number;
  capacity: number;
  isFavorite?: boolean;
  isConfirmed?: boolean;
  onFavoriteClick?: () => void;
  onParticipateClick?: () => void;
}

export function MeetingCard({
  imageUrl,
  title,
  location,
  category,
  dateTime,
  registrationEnd,
  participantCount,
  capacity,
  isFavorite = false,
  isConfirmed = false,
  onFavoriteClick,
  onParticipateClick,
}: MeetingCardProps) {
  const { isClosed } = formatRegistrationEnd(registrationEnd);

  const favoriteButton = isClosed ? (
    <button
      type="button"
      disabled
      aria-label="모집 마감"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white"
    >
      <Hand
        size={20}
        strokeWidth={1.8}
        className="text-primary-500"
        aria-hidden="true"
      />
    </button>
  ) : (
    <LikeButton
      size="md"
      isLiked={isFavorite}
      onToggle={onFavoriteClick ?? (() => {})}
    />
  );

  return (
    <article
      className="
        col-span-2
        w-full min-w-0 overflow-hidden
        rounded-[24px] bg-white p-4
        sm:p-5
        min-[1100px]:col-span-1
      "
    >
      <div className="flex flex-col min-[640px]:hidden">
        <div className="relative aspect-[16/9] w-full max-h-[260px] overflow-hidden rounded-[20px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="100vw"
            className={`object-cover ${isClosed ? "brightness-50" : ""}`}
          />

          {isClosed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">모집 마감</span>
            </div>
          )}

          <div className="absolute right-3 top-3">
            {favoriteButton}
          </div>
        </div>

        <div className="mt-4 min-w-0">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-start gap-2">
                <h3 className="min-w-0 break-keep text-base font-bold leading-5 text-gray-900">
                  {title}
                </h3>

                {isConfirmed && (
                  <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-primary-500">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-500">
                      <span className="text-[10px] font-bold leading-none text-white">
                        ✓
                      </span>
                    </span>
                    개설 확정
                  </span>
                )}
              </div>

              <div className="mt-1 flex min-w-0 items-center gap-1 text-xs leading-5 text-gray-500">
                <MapPin
                  size={15}
                  fill="currentColor"
                  strokeWidth={0}
                  className="shrink-0"
                />
                <span className="truncate">
                  {location} · {category}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 w-full overflow-hidden">
            <div className="origin-left scale-[0.8] whitespace-nowrap">
              <Tags
                dateTime={dateTime}
                registrationEnd={registrationEnd}
                order="date-first"
              />
            </div>
          </div>

          <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <MeetingProgressBar
                participantCount={participantCount}
                capacity={capacity}
              />
            </div>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={isClosed}
              onClick={onParticipateClick}
              className={
                isClosed
                  ? "h-10 shrink-0 border-transparent bg-gray-100 px-4 text-gray-400"
                  : "h-10 shrink-0 border-primary-500 px-4 text-primary-500"
              }
            >
              참여하기
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden min-h-[142px] min-w-0 items-stretch gap-5 min-[640px]:flex">
        <div className="relative h-[142px] w-[142px] shrink-0 overflow-hidden rounded-[20px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="142px"
            className={`object-cover ${isClosed ? "brightness-50" : ""}`}
          />

          {isClosed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">모집 마감</span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-start gap-2">
                <h3 className="min-w-0 break-keep font-bold leading-5 text-gray-900">
                  {title}
                </h3>

                {isConfirmed && (
                  <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-primary-500">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-500">
                      <span className="text-[10px] font-bold leading-none text-white">
                        ✓
                      </span>
                    </span>
                    개설 확정
                  </span>
                )}
              </div>

              <div className="mt-1 flex min-w-0 items-center gap-1 text-xs leading-5 text-gray-500">
                <MapPin
                  size={15}
                  fill="currentColor"
                  strokeWidth={0}
                  className="shrink-0"
                />
                <span className="truncate">
                  {location} · {category}
                </span>
              </div>
            </div>

            <div className="shrink-0">{favoriteButton}</div>
          </div>

          <div className="mt-auto min-w-0 overflow-hidden">
            <div className="origin-left scale-[0.8] whitespace-nowrap">
              <Tags
                dateTime={dateTime}
                registrationEnd={registrationEnd}
                order="date-first"
              />
            </div>
          </div>

          <div className="mt-3 flex min-w-0 items-center justify-between gap-4">
            <MeetingProgressBar
              participantCount={participantCount}
              capacity={capacity}
            />

            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={isClosed}
              onClick={onParticipateClick}
              className={
                isClosed
                  ? "h-10 shrink-0 border-transparent bg-gray-100 px-4 text-gray-400"
                  : "h-10 shrink-0 border-primary-500 px-4 text-primary-500"
              }
            >
              참여하기
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}