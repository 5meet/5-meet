
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

  useEffect(() => {
    const target = loadMoreRef.current;

    if (
      !target ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError
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
      { rootMargin: "200px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  ]);

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex h-[780px] w-full items-center justify-center rounded-[24px] bg-white">
        <p className="text-sm text-gray-500">
          작성한 리뷰를 불러오는 중입니다.
        </p>
      </div>
    );
  }

  if (isError && reviews.length === 0) {
    return (
      <div className="flex h-[780px] w-full items-center justify-center rounded-[24px] bg-white">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            작성한 리뷰를 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 text-sm text-blue-600 underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

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
        <ReviewCard key={review.id} review={review} />
      ))}

      <div
        ref={loadMoreRef}
        className="flex min-h-10 flex-col items-center justify-center"
      >
        {isFetchingNextPage && (
          <p className="py-3 text-sm text-gray-400">
            리뷰를 더 불러오는 중입니다.
          </p>
        )}

        {isFetchNextPageError && (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500">
              다음 리뷰를 불러오지 못했습니다.
            </p>
            <button
              type="button"
              onClick={() => void fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mt-2 text-sm text-blue-600 underline disabled:opacity-50"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
