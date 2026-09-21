"use client";

import Image from "next/image";
import { Heart, Hand, MapPin, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/Button/Button";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";
import Tags from "@/components/ui/Tags/Tags";
import MeetingProgressBar from "@/components/ui/ProgressBar/MeetingProgressBar";
import formatRegistrationEnd from "@/lib/convertDate/formatRegistrationEnd";

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

  return (
    <article className="w-full rounded-[24px] bg-white p-5">
      <div className="flex gap-5">
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

        <div className="flex min-h-[142px] min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="min-w-0 text-[16px] font-bold leading-5 text-gray-900">
                  {title}
                </h3>

                {isConfirmed && (
                  <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-primary-500">
                    <CircleCheck
                      size={14}
                      strokeWidth={2.5}
                      className="text-primary-500"
                    />
                    개설 확정
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-1 text-xs leading-5 text-gray-500">
                <MapPin size={15} fill="currentColor" strokeWidth={0} />
                <span>
                  {location} · {category}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={isClosed ? undefined : onFavoriteClick}
              disabled={isClosed}
              aria-label={
                isClosed ? "모집 마감" : isFavorite ? "찜 취소" : "찜하기"
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 disabled:cursor-default"
            >
              {isClosed ? (
                <button
                  type="button"
                  disabled
                  aria-label="모집 마감"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200"
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
              )}
            </button>
          </div>

          <div className="mt-auto">
            <div className="overflow-visible">
              <div className="origin-left scale-[0.8] whitespace-nowrap">
                <Tags
                  dateTime={dateTime}
                  registrationEnd={registrationEnd}
                  order="date-first"
                />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-4">
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
      </div>
    </article>
  );
}
