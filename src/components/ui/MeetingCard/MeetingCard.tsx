"use client";

import Image from "next/image";
import { Calendar, Hand, MapPin, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/Button/Button";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";
import formatMeetingDate from "@/lib/date/formatMeetingDate";
import formatRegistrationEnd from "@/lib/date/formatRegistrationEnd";

export type MeetingCardVariant = "list" | "popular" | "recommended";

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
  /** list = 모바일 기존 가로형. popular/recommended = 데스크톱 시안 세로 카드 */
  variant?: MeetingCardVariant;
}

function FavoriteControl({
  isClosed,
  isFavorite,
  onFavoriteClick,
}: {
  isClosed: boolean;
  isFavorite: boolean;
  onFavoriteClick?: () => void;
}) {
  if (isClosed) {
    return (
      <div
        role="img"
        aria-label="모집 마감"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white"
      >
        <Hand
          size={18}
          strokeWidth={1.8}
          className="text-primary-500"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <LikeButton
      size="md"
      isLiked={isFavorite}
      onToggle={onFavoriteClick ?? (() => {})}
    />
  );
}

function MetaRow({
  dateTime,
  participantCount,
  capacity,
}: {
  dateTime: string;
  participantCount: number;
  capacity: number;
}) {
  const { date, time } = formatMeetingDate(dateTime);
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 text-xs text-gray-600">
      <span className="flex min-w-0 items-center gap-1">
        <Calendar size={14} className="shrink-0" />
        <span className="truncate">
          {date} {time}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        <Image src="/person.svg" alt="" width={16} height={16} />
        <span>
          <span className="font-semibold text-primary-500">
            {participantCount}
          </span>
          /{capacity}
        </span>
      </span>
    </div>
  );
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
  variant = "list",
}: MeetingCardProps) {
  const { isClosed, text: deadlineText } =
    formatRegistrationEnd(registrationEnd);
  const isDesktopCard = variant !== "list";

  return (
    <article
      className={`w-full min-w-0 max-w-full overflow-hidden bg-white ${
        isDesktopCard ? "rounded-[20px]" : "rounded-[24px] p-4"
      }`}
    >
      {/* 모바일 기존 가로형 — md에서 그리드 카드가 대신 보임 */}
      <div className={isDesktopCard ? "flex min-w-0 gap-3 md:hidden" : "flex min-w-0 gap-3"}>
        <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-[20px] sm:h-[142px] sm:w-[142px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="142px"
            className={`object-cover ${isClosed ? "brightness-50" : ""}`}
          />
          {isClosed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white sm:text-xl">
                모집 마감
              </span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                {title}
              </h3>
              <p className="mt-1 truncate text-xs text-gray-500">
                {location} · {category}
              </p>
            </div>
            <FavoriteControl
              isClosed={isClosed}
              isFavorite={isFavorite}
              onFavoriteClick={onFavoriteClick}
            />
          </div>
          <div className="mt-auto pt-2">
            <MetaRow
              dateTime={dateTime}
              participantCount={participantCount}
              capacity={capacity}
            />
            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={isClosed}
                onClick={onParticipateClick}
              >
                참여하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 데스크톱 시안: 이미지 위 + 4열 세로 카드 */}
      {isDesktopCard ? (
        <div className="hidden md:block">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px]">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className={`object-cover ${isClosed ? "brightness-50" : ""}`}
            />
            {isClosed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-lg font-bold text-white">모집 마감</span>
              </div>
            )}
            <div className="absolute right-3 top-3">
              <FavoriteControl
                isClosed={isClosed}
                isFavorite={isFavorite}
                onFavoriteClick={onFavoriteClick}
              />
            </div>
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
              {variant === "recommended" ? (
                <span className="rounded-md bg-primary-500 px-2 py-0.5 text-xs font-semibold text-white">
                  추천
                </span>
              ) : isConfirmed ? (
                <span className="flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-xs font-semibold text-primary-600">
                  <CircleCheck size={14} />
                  개설확정
                </span>
              ) : (
                <span className="rounded-md bg-sky-500/90 px-2 py-0.5 text-xs font-semibold text-white">
                  {deadlineText}
                </span>
              )}
            </div>
          </div>

          <div className="px-1 pt-3">
            <h3 className="truncate font-bold text-gray-900">{title}</h3>
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500">
              <MapPin size={14} fill="currentColor" strokeWidth={0} />
              {category} · {location}
            </p>
            <div className="mt-2">
              <MetaRow
                dateTime={dateTime}
                participantCount={participantCount}
                capacity={capacity}
              />
            </div>
            {variant === "popular" ? (
              <div className="mt-3 flex items-center gap-2">
                <FavoriteControl
                  isClosed={isClosed}
                  isFavorite={isFavorite}
                  onFavoriteClick={onFavoriteClick}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  disabled={isClosed}
                  onClick={onParticipateClick}
                  className="h-9 flex-1 rounded-full"
                >
                  참여하기
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
