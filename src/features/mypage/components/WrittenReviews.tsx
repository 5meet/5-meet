import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { ReviewCard } from "@/components/ui/ReviewCard/ReviewCard";

import type { ReviewApiItem } from "@/features/reviews/types";

const writtenReviews: ReviewApiItem[] = [
  {
    id: 1,
    teamId: "5-meet",
    meetingId: 1,
    userId: 1,
    score: 5,
    comment:
      "따뜻하게 느껴지는 공간이에요. 평소에 달램 이용해보고 싶었는데 같이달램 생기니까 너무 좋아요!",
    createdAt: "2024-01-25T00:00:00.000Z",
    updatedAt: "2024-01-25T00:00:00.000Z",
    user: {
      id: 1,
      email: "",
      name: "럽인조을",
      image: null,
    },
    meeting: {
      id: 1,
      name: "힐링 오피스 스트레칭",
      type: "취미/여가",
      region: "강남구",
      image: "",
      dateTime: "2024-01-25T17:30:00.000Z",
    },
  },
  {
    id: 2,
    teamId: "5-meet",
    meetingId: 1,
    userId: 1,
    score: 5,
    comment:
      "따뜻하게 느껴지는 공간이에요. 평소에 달램 이용해보고 싶었는데 같이달램 생기니까 너무 좋아요!",
    createdAt: "2024-01-25T00:00:00.000Z",
    updatedAt: "2024-01-25T00:00:00.000Z",
    user: {
      id: 1,
      email: "",
      name: "럽인조을",
      image: null,
    },
    meeting: {
      id: 1,
      name: "힐링 오피스 스트레칭",
      type: "취미/여가",
      region: "강남구",
      image: "",
      dateTime: "2024-01-25T17:30:00.000Z",
    },
  },
  {
    id: 3,
    teamId: "5-meet",
    meetingId: 1,
    userId: 1,
    score: 5,
    comment:
      "따뜻하게 느껴지는 공간이에요. 평소에 달램 이용해보고 싶었는데 같이달램 생기니까 너무 좋아요!",
    createdAt: "2024-01-25T00:00:00.000Z",
    updatedAt: "2024-01-25T00:00:00.000Z",
    user: {
      id: 1,
      email: "",
      name: "럽인조을",
      image: null,
    },
    meeting: {
      id: 1,
      name: "힐링 오피스 스트레칭",
      type: "취미/여가",
      region: "강남구",
      image: "",
      dateTime: "2024-01-25T17:30:00.000Z",
    },
  },
  {
    id: 4,
    teamId: "5-meet",
    meetingId: 1,
    userId: 1,
    score: 5,
    comment:
      "따뜻하게 느껴지는 공간이에요. 평소에 달램 이용해보고 싶었는데 같이달램 생기니까 너무 좋아요!",
    createdAt: "2024-01-25T00:00:00.000Z",
    updatedAt: "2024-01-25T00:00:00.000Z",
    user: {
      id: 1,
      email: "",
      name: "럽인조을",
      image: null,
    },
    meeting: {
      id: 1,
      name: "힐링 오피스 스트레칭",
      type: "취미/여가",
      region: "강남구",
      image: "",
      dateTime: "2024-01-25T17:30:00.000Z",
    },
  },
  {
    id: 5,
    teamId: "5-meet",
    meetingId: 1,
    userId: 1,
    score: 4,
    comment:
      "편안하고 따뜻한 분위기라서 즐겁게 참여할 수 있었습니다.",
    createdAt: "2024-01-25T00:00:00.000Z",
    updatedAt: "2024-01-25T00:00:00.000Z",
    user: {
      id: 1,
      email: "",
      name: "럽인조을",
      image: null,
    },
    meeting: {
      id: 1,
      name: "힐링 오피스 스트레칭",
      type: "취미/여가",
      region: "강남구",
      image: "",
      dateTime: "2024-01-25T17:30:00.000Z",
    },
  },
];

export default function WrittenReviews() {
  if (writtenReviews.length === 0) {
    return (
      <EmptyState message="작성한 리뷰가 없어요." />
    );
  }

  return (
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
  );
}