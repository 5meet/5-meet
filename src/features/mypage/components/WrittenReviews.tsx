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
    isFetching,
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

  const isInitialError = isError && reviews.length === 0;
  const isNextPageError =
    isFetchNextPageError && reviews.length > 0;

  // 기존 목록이 있는 상태에서 첫 페이지 재조회가 실패한 경우
  const isRefetchError =
    isError && reviews.length > 0 && !isFetchNextPageError;

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

    return () => observer.disconnect();
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

  // 최초 조회 실패: 표시할 리뷰가 없는 경우
  if (isInitialError) {
    return (
      <div className="flex h-[780px] w-full flex-col items-center justify-center rounded-[24px] bg-white">
        <p className="text-sm text-gray-500">
          작성한 리뷰를 불러오지 못했어요.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="mt-4 rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFetching ? "다시 불러오는 중..." : "다시 시도"}
        </button>
      </div>
    );
  }

  // 작성한 리뷰가 없는 경우
  if (reviews.length === 0) {
    return <EmptyState message="작성한 리뷰가 없어요." />;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* 기존 목록이 있는 상태에서 재조회가 실패해도 목록을 유지한다. */}
      {isRefetchError && (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-xl bg-white p-4"
        >
          <p className="text-center text-sm text-gray-500">
            리뷰를 새로 불러오지 못했어요. 기존 리뷰는 그대로 표시돼요.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetching ? "다시 불러오는 중..." : "다시 시도"}
          </button>
        </div>
      )}

      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={{
            ...review,
            teamId: review.teamId || "5-meet",
            meeting: {
              ...review.meeting,
              region: review.meeting.region ?? "",
            },
          }}
        />
      ))}

      <div
        ref={loadMoreRef}
        className="flex flex-col items-center justify-center gap-3 py-4"
      >
        {isFetchingNextPage && (
          <p className="text-sm text-gray-500">
            리뷰를 더 불러오는 중이에요.
          </p>
        )}

        {isNextPageError && (
          <>
            <p role="alert" className="text-center text-sm text-gray-500">
              리뷰를 더 불러오지 못했어요. 기존 리뷰는 그대로 표시돼요.
            </p>

            <button
              type="button"
              onClick={() => void fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isFetchingNextPage ? "다시 불러오는 중..." : "다시 시도"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
