"use client";

import { useState } from "react";

import ReviewMeetingCard, {
  type ReviewMeetingCardProps,
} from "./ReviewMeetingCard";

import MyPageTabs from "./MyPageTabs";

type ReviewTabType = "available" | "written";

interface ReviewTabProps {
  meetings: ReviewMeetingCardProps[];
  writtenMeetings?: ReviewMeetingCardProps[];
  onReviewClick?: (meetingId: number) => void;
  onFavoriteClick?: (meetingId: number) => void;
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
    activeTab === "available"
      ? meetings
      : writtenMeetings;

  return (
    <section className="w-full">
      {/* 마이페이지 탭 */}
      <MyPageTabs />

      {/* 리뷰 탭 */}
      <div className="mb-5 mt-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("available")}
          className={`
            rounded-full
            px-5
            py-2.5
            text-sm
            font-semibold
            transition-colors
            ${
              activeTab === "available"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700"
            }
          `}
        >
          작성 가능한 리뷰
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("written")}
          className={`
            rounded-full
            px-5
            py-2.5
            text-sm
            font-semibold
            transition-colors
            ${
              activeTab === "written"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700"
            }
          `}
        >
          작성한 리뷰
        </button>
      </div>

      {/* 리뷰 목록 */}
      <div className="flex flex-col gap-5">
        {currentMeetings.map((meeting) => (
          <ReviewMeetingCard
            key={meeting.id}
            {...meeting}
            onReviewClick={() =>
              onReviewClick?.(meeting.id)
            }
            onFavoriteClick={() =>
              onFavoriteClick?.(meeting.id)
            }
          />
        ))}
      </div>
    </section>
  );
}