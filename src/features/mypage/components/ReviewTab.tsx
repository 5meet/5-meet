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
}: ReviewTabProps) {
  const [activeTab, setActiveTab] =
    useState<ReviewTabType>("available");

  const currentMeetings =
    activeTab === "available"
      ? meetings
      : writtenMeetings;

  return (
    <section className="w-full">
      <MyPageTabs />

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

      <div className="flex flex-col gap-5">
        {currentMeetings.map((meeting, index) => (
          <ReviewMeetingCard
            key={index}
            {...meeting}
          />
        ))}
      </div>
    </section>
  );
}