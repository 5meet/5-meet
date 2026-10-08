"use client";

import { useEffect, useRef } from "react";

import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { ReviewCard } from "@/components/ui/ReviewCard/ReviewCard";

import { useMyReviewsQuery } from "@/features/mypage/hooks/useMyReviewsQuery";

const REVIEW_SIZE = 10;

export default function WrittenReviews() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMyReviewsQuery({
    sortBy: "createdAt",
    sortOrder: "desc",
    size: REVIEW_SIZE,
  });

  const reviews =
    data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const target = loadMoreRef.current;

    if (
      !target ||
      !hasNextPage ||
      isFetchingNextPage
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (
          firstEntry?.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          void fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

  if (isLoading) {
    return (
      <div
        className="
          flex
          h-[780px]
          w-full
          items-center
          justify-center
          rounded-[24px]
          bg-white
        "
      >
        <p className="text-sm text-gray-500">
          작성한 리뷰를 불러오는 중이에요.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
          flex
          h-[780px]
          w-full
          items-center
          justify-center
          rounded-[24px]
          bg-white
        "
      >
        <p className="text-sm text-gray-500">
          작성한 리뷰를 불러오지 못했어요.
        </p>
      </div>
    );
  }

  if (reviews.length === 0) {
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
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={{
            id: review.id,
            teamId: "5-meet",
            meetingId: review.meetingId,
            userId: 0,
            score: review.score,
            comment: review.comment,
            createdAt: review.createdAt,
            updatedAt: review.createdAt,
            user: undefined,
            meeting: {
              id: review.meeting.id,
              name: review.meeting.name,
              type: review.meeting.type,
              region: "",
              image: review.meeting.image,
              dateTime: review.meeting.dateTime,
            },
          }}
        />
      ))}

      <div
        ref={loadMoreRef}
        className="flex min-h-10 items-center justify-center"
      >
        {isFetchingNextPage && (
          <p className="text-sm text-gray-400">
            리뷰를 더 불러오는 중이에요.
          </p>
        )}
      </div>
    </div>
  );
}