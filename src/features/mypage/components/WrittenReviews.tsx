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
    isFetchNextPageError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useMyReviewsQuery({
    sortBy: "createdAt",
    sortOrder: "desc",
    size: REVIEW_SIZE,
  });

  const reviews = data?.pages.flatMap((page) => page.data) ?? [];

  // 최초 조회 실패와 추가 페이지 조회 실패를 구분한다.
  const isInitialError = isError && reviews.length === 0;
  const isNextPageError =
    isFetchNextPageError && reviews.length > 0;

  useEffect(() => {
    const target = loadMoreRef.current;

    if (
      !target ||
      !hasNextPage ||
      isFetchingNextPage ||
      isNextPageError
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
    isNextPageError,
  ]);

  // 최초 조회 중
  if (isLoading && !data) {
    return (
      <div className="flex h-[780px] w-full items-center justify-center rounded-[24px] bg-white">
        <p className="text-sm text-gray-500">
          작성한 리뷰를 불러오는 중이에요.
        </p>
      </div>
    );
  }

  // 최초 조회 실패: 리뷰가 없을 때만 전체 오류 화면 표시
  if (isInitialError) {
    return (
      <div className="flex h-[780px] w-full flex-col items-center justify-center rounded-[24px] bg-white">
        <p className="text-sm text-gray-500">
          작성한 리뷰를 불러오지 못했어요.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-3 text-sm text-blue-600 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 작성한 리뷰가 없는 경우
  if (reviews.length === 0) {
    return <EmptyState message="작성한 리뷰가 없어요." />;
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
            userId: review.userId,
            score: review.score,
            comment: review.comment,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            user: review.user,
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
        className="flex min-h-10 flex-col items-center justify-center gap-2 py-2"
      >
        {isFetchingNextPage && (
          <p className="text-sm text-gray-400">
            리뷰를 더 불러오는 중이에요.
          </p>
        )}

        {isNextPageError && (
          <div className="flex flex-col items-center gap-2 py-3">
            <p className="text-center text-sm text-gray-500">
              리뷰를 더 불러오지 못했어요. 기존 리뷰는 그대로 표시돼요.
            </p>
            <button
              type="button"
              onClick={() => void fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-sm text-blue-600 underline disabled:opacity-50"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
