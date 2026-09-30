"use client";

import Image from "next/image";
import { MapPin, Heart, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";

type ReviewTabType = "available" | "written";

export interface ReviewMeeting {
  id: number;
  imageUrl: string;
  title: string;
  location: string;
  date: string;
  time: string;
  participantCount: number;
  capacity: number;
  isFavorite: boolean;
}

interface ReviewTabProps {
  meetings: ReviewMeeting[];
  writtenMeetings?: ReviewMeeting[];
  onReviewClick?: (meetingId: number) => void;
  onFavoriteClick?: (meetingId: number) => void;
}

interface ReviewMeetingCardProps {
  meeting: ReviewMeeting;
  onReviewClick?: () => void;
  onFavoriteClick?: () => void;
}

function ReviewMeetingCard({
  meeting,
  onReviewClick,
  onFavoriteClick,
}: ReviewMeetingCardProps) {
  return (
    <article className="flex w-full min-w-0 items-stretch gap-5 rounded-[24px] bg-white p-5 sm:p-6">
      {/* 이미지 */}
      <div className="relative h-[180px] w-[180px] shrink-0 overflow-hidden rounded-[20px] max-sm:h-[110px] max-sm:w-[110px]">
        <Image
          src={meeting.imageUrl}
          alt={meeting.title}
          fill
          sizes="(max-width: 640px) 110px, 180px"
          className="object-cover"
        />
      </div>

      {/* 내용 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 상단 */}
        <div className="flex min-w-0 items-start justify-between gap-4">
          <h3 className="min-w-0 truncate text-lg font-bold text-gray-900 sm:text-xl">
            {meeting.title}
          </h3>

          <button
            type="button"
            onClick={onFavoriteClick}
            aria-label="좋아요"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200"
          >
            <Heart
              size={22}
              strokeWidth={1.8}
              fill={meeting.isFavorite ? "currentColor" : "none"}
              className={
                meeting.isFavorite
                  ? "text-primary-500"
                  : "text-gray-300"
              }
            />
          </button>
        </div>

        {/* 하단 영역 */}
        <div className="mt-auto flex min-w-0 items-end justify-between gap-4">
          <div className="min-w-0">
            {/* 참여 인원 */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <Users
                size={16}
                fill="currentColor"
                strokeWidth={0}
                className="text-gray-400"
              />

              <span>
                {meeting.participantCount}/{meeting.capacity}
              </span>
            </div>

            {/* 위치 / 날짜 / 시간 */}
            <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin
                  size={14}
                  fill="currentColor"
                  strokeWidth={0}
                />
                위치 {meeting.location}
              </span>

              <span className="text-gray-300">|</span>

              <span>날짜 {meeting.date}</span>

              <span className="text-gray-300">|</span>

              <span>시간 {meeting.time}</span>
            </div>
          </div>

          {/* 리뷰 작성 */}
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onReviewClick}
            className="h-12 shrink-0 rounded-xl px-8"
          >
            리뷰 작성하기
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function ReviewTab({
  meetings,
  writtenMeetings = [],
  onReviewClick,
  onFavoriteClick,
}: ReviewTabProps) {
  const [activeTab, setActiveTab] =
    useState<ReviewTabType>("available");

  const currentMeetings =
    activeTab === "available" ? meetings : writtenMeetings;

  return (
    <section className="w-full">
      {/* 리뷰 필터 */}
      <div className="mb-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("available")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "available"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          작성 가능한 리뷰
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("written")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "written"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          작성한 리뷰
        </button>
      </div>

      {/* 리뷰 목록 */}
      <div className="flex flex-col gap-5">
        {currentMeetings.map((meeting) => (
          <ReviewMeetingCard
            key={meeting.id}
            meeting={meeting}
            onReviewClick={() => onReviewClick?.(meeting.id)}
            onFavoriteClick={() => onFavoriteClick?.(meeting.id)}
          />
        ))}
      </div>
    </section>
  );
}