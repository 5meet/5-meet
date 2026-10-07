"use client";

import { useState } from "react";

import AvailableReviews from "@/features/mypage/components/AvailableReviews";
import WrittenReviews from "@/features/mypage/components/WrittenReviews";

type ReviewTab = "available" | "written";

const REVIEW_TABS: {
  value: ReviewTab;
  label: string;
}[] = [
  {
    value: "available",
    label: "작성 가능한 리뷰",
  },
  {
    value: "written",
    label: "작성한 리뷰",
  },
];

export default function ReviewsContent() {
  const [activeTab, setActiveTab] =
    useState<ReviewTab>("available");

  return (
    <div className="w-full">
      <div className="mb-5 mt-6 flex gap-2">
        {REVIEW_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() =>
              setActiveTab(tab.value)
            }
            className={`
              rounded-full
              px-5
              py-2.5
              text-sm
              font-semibold
              transition-colors
              ${
                activeTab === tab.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "available" ? (
        <AvailableReviews />
      ) : (
        <WrittenReviews />
      )}
    </div>
  );
}