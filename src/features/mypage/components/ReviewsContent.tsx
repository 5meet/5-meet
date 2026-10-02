"use client";

import { useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { ReviewCard } from "@/components/ui/ReviewCard/ReviewCard";
import type { Review } from "@/data/reviews";
import ReviewMeetingCard from "@/features/mypage/components/ReviewMeetingCard";

const reviewMeetings = [
  {
    id: 1,
    imageUrl: "/images/meeting-1.jpg",
    title: "힐링 오피스 스트레칭",
    location: "강남구",
    date: "11월 17일",
    time: "17:30",
    participantCount: 20,
    capacity: 20,
    isFavorite: true,
  },
  {
    id: 2,
    imageUrl: "/images/meeting-2.jpg",
    title: "작은 독서 습관 만들기",
    location: "중구",
    date: "11월 17일",
    time: "17:30",
    participantCount: 20,
    capacity: 20,
    isFavorite: false,
  },
];

const writtenReviews: Review[] = [
  {
    id: 1,
    imageUrl: "",
    rating: 5,
    authorName: "럽인조을",
    createdAt: "2024.01.25",
    content:
      "따뜻하게 느껴지는 공간이에요. 평소에 달램 이용해보고 싶었는데 같이달램 생기니까 너무 좋아요!",
    groupName: "힐링 오피스 스트레칭",
    category: "취미/여가",
  },
  {
    id: 2,
    imageUrl: "",
    rating: 5,
    authorName: "럽인조을",
    createdAt: "2024.01.25",
    content:
      "따뜻하게 느껴지는 공간이에요. 평소에 달램 이용해보고 싶었는데 같이달램 생기니까 너무 좋아요!",
    groupName: "힐링 오피스 스트레칭",
    category: "취미/여가",
  },
  {
    id: 3,
    imageUrl: "",
    rating: 5,
    authorName: "럽인조을",
    createdAt: "2024.01.25",
    content:
      "따뜻하게 느껴지는 공간이에요. 평소에 달램 이용해보고 싶었는데 같이달램 생기니까 너무 좋아요!",
    groupName: "힐링 오피스 스트레칭",
    category: "취미/여가",
  },
  {
    id: 4,
    imageUrl: "",
    rating: 5,
    authorName: "럽인조을",
    createdAt: "2024.01.25",
    content:
      "따뜻하게 느껴지는 공간이에요. 평소에 달램 이용해보고 싶었는데 같이달램 생기니까 너무 좋아요!",
    groupName: "힐링 오피스 스트레칭",
    category: "취미/여가",
  },
  {
    id: 5,
    imageUrl: "",
    rating: 4,
    authorName: "럽인조을",
    createdAt: "2024.01.25",
    content:
      "편안하고 따뜻한 분위기라서 즐겁게 참여할 수 있었습니다.",
    groupName: "힐링 오피스 스트레칭",
    category: "취미/여가",
  },
];

export default function ReviewsContent() {
  const [activeTab, setActiveTab] = useState<
    "available" | "written"
  >("available");

  return (
    <div className="w-full">
      <div className="mb-5 mt-6 flex gap-2">
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

      {activeTab === "available" && (
        <>
          {reviewMeetings.length > 0 ? (
            <div className="flex flex-col gap-5">
              {reviewMeetings.map((meeting) => (
                <ReviewMeetingCard
                  key={meeting.id}
                  {...meeting}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="작성 가능한 리뷰가 없어요." />
          )}
        </>
      )}

      {activeTab === "written" && (
        <>
          {writtenReviews.length > 0 ? (
            <div
              className="
                h-[780px]
                w-full
                overflow-y-auto
                rounded-[24px]
                bg-white
                px-5
                py-2
                sm:px-6
                md:px-8
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
              "
            >
              {writtenReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="작성한 리뷰가 없어요." />
          )}
        </>
      )}
    </div>
  );
}