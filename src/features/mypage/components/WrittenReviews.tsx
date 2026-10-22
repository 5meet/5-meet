"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { deleteReview } from "@/features/reviews/api/deleteReview";
import { updateReview } from "@/features/reviews/api/updateReview";
import type { ReviewApiItem } from "@/features/reviews/types";
import { useMyReviewsQuery } from "@/features/mypage/hooks/useMyReviewsQuery";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import ReviewCard from "@/components/ui/ReviewCard/ReviewCard";

const PAGE_SIZE = 10;

export default function WrittenReviews() {
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // 목록 전체에서 한 번에 하나의 요청만 허용한다.
  // useRef를 함께 사용해 React 상태 업데이트 전 중복 클릭도 차단한다.
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
    isFetchingNextPage,
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
      isError
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
        rootMargin: "100px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isError, fetchNextPage]);

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
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "리뷰 삭제에 실패했습니다. 다시 시도해 주세요.";

        setDeleteError(message);
        throw error;
      } finally {
        processingLockRef.current = false;
        setProcessingReviewId(null);
      }
    },
    [refreshReviews],
  );

  if (isPending) {
    return (
      <p className="py-8 text-center">
        리뷰를 불러오는 중입니다...
      </p>
    );
  }

  if (isError && reviews.length === 0) {
    return (
      <div>
        <EmptyState
          message={
            error instanceof Error
              ? error.message
              : "리뷰를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
          }
        />
        <div className="text-center">
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-md border px-4 py-2 text-sm"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="h-[70vh] min-h-[400px] overflow-y-auto overscroll-contain pr-3"
    >
      {deleteError && (
        <p role="alert" className="mb-4 text-sm text-red-500">
          {deleteError}
        </p>
      )}

      {reviews.length === 0 ? (
        <EmptyState message="작성한 리뷰가 없습니다." />
      ) : (
        <section className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
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
                ? "다음 리뷰를 불러오는 중입니다..."
                : isError
                  ? "다음 리뷰를 불러오지 못했습니다."
                  : "스크롤하면 다음 리뷰를 불러옵니다."}
            </div>
          )}

          {isError && reviews.length > 0 && (
            <button
              type="button"
              onClick={() => void fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mx-auto block rounded-md border px-4 py-2 text-sm disabled:opacity-50"
            >
              다음 리뷰 다시 시도
            </button>
          )}
        </section>
      )}
    </div>
  );
}