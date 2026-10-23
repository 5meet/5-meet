"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import ReviewCard from "@/components/ui/ReviewCard/ReviewCard";
import { deleteReview } from "@/features/reviews/api/deleteReview";
import { updateReview } from "@/features/reviews/api/updateReview";
import type { ReviewApiItem } from "@/features/reviews/types";
import { useMyReviewsQuery } from "@/features/mypage/hooks/useMyReviewsQuery";

const PAGE_SIZE = 10;

export default function WrittenReviews() {
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const processingLockRef = useRef(false);

  const [processingReviewId, setProcessingReviewId] = useState<number | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState("");

  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    refetch,
  } = useMyReviewsQuery({
    sortBy: "createdAt",
    sortOrder: "desc",
    size: PAGE_SIZE,
  });

  const reviews = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const isInitialError = isError && reviews.length === 0;
  const isNextPageError = isFetchNextPageError && reviews.length > 0;
  const isRefetchError =
    isError && reviews.length > 0 && !isFetchNextPageError;

  const refreshReviews = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["mypage", "reviews", "available"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["mypage", "reviews", "written"],
      }),
    ]);
  }, [queryClient]);

  useEffect(() => {
    const root = scrollContainerRef.current;
    const target = observerTarget.current;

    if (
      !root ||
      !target ||
      !hasNextPage ||
      isFetchingNextPage ||
      isNextPageError
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      {
        root,
        rootMargin: "200px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isNextPageError]);

  const handleEdit = useCallback(
    async (updatedReview: ReviewApiItem) => {
      if (processingLockRef.current) {
        throw new Error(
          "다른 리뷰를 처리 중입니다. 잠시 후 다시 시도해 주세요.",
        );
      }

      processingLockRef.current = true;
      setProcessingReviewId(updatedReview.id);

      try {
        await updateReview(updatedReview.teamId, updatedReview.id, {
          score: updatedReview.score,
          comment: updatedReview.comment,
        });

        await refreshReviews();
      } finally {
        processingLockRef.current = false;
        setProcessingReviewId(null);
      }
    },
    [refreshReviews],
  );

  const handleDelete = useCallback(
    async (review: ReviewApiItem) => {
      if (processingLockRef.current) {
        throw new Error(
          "다른 리뷰를 처리 중입니다. 잠시 후 다시 시도해 주세요.",
        );
      }

      if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;

      processingLockRef.current = true;
      setProcessingReviewId(review.id);
      setDeleteError("");

      try {
        await deleteReview(review.teamId, review.id);
        await refreshReviews();
      } catch (deleteFailure) {
        const message =
          deleteFailure instanceof Error
            ? deleteFailure.message
            : "리뷰 삭제에 실패했습니다. 다시 시도해 주세요.";

        setDeleteError(message);
        throw deleteFailure;
      } finally {
        processingLockRef.current = false;
        setProcessingReviewId(null);
      }
    },
    [refreshReviews],
  );

  if (isPending && !data) {
    return (
      <div className="flex h-[780px] w-full items-center justify-center rounded-[24px] bg-white">
        <p className="text-sm text-gray-500">
          작성한 리뷰를 불러오는 중이에요.
        </p>
      </div>
    );
  }

  if (isInitialError) {
    return (
      <div className="flex h-[780px] w-full flex-col items-center justify-center rounded-[24px] bg-white">
        <p role="alert" className="text-sm text-gray-500">
          {error instanceof Error
            ? error.message
            : "작성한 리뷰를 불러오지 못했어요."}
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

  if (reviews.length === 0) {
    return <EmptyState message="작성한 리뷰가 없어요." />;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="h-[780px] w-full overflow-y-auto rounded-[24px] bg-white px-5 py-2 sm:px-6 md:px-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400"
    >
      {deleteError && (
        <p role="alert" className="mb-4 text-sm text-red-500">
          {deleteError}
        </p>
      )}

      {isRefetchError && (
        <div
          role="alert"
          className="mb-4 flex flex-col items-center gap-3 rounded-xl bg-gray-50 p-4"
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

      <section className="space-y-4">
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
            showEditButton
            showDeleteAction
            isProcessing={processingReviewId !== null}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {hasNextPage && (
          <div
            ref={observerTarget}
            className="py-3 text-center text-sm text-gray-500"
            aria-live="polite"
          >
            {isFetchingNextPage
              ? "다음 리뷰를 불러오는 중이에요."
              : "스크롤하면 다음 리뷰를 불러옵니다."}
          </div>
        )}

        {isNextPageError && (
          <div className="flex flex-col items-center gap-3 py-4">
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
          </div>
        )}
      </section>
    </div>
  );
}