"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import ReviewCard from "@/components/ui/ReviewCard/ReviewCard";

import { deleteReview } from "@/features/reviews/api/deleteReview";
import { updateReview } from "@/features/reviews/api/updateReview";
import type { ReviewApiItem } from "@/features/reviews/types";

const PAGE_SIZE = 10;

export default function WrittenReviews() {
  const [reviews, setReviews] = useState<ReviewApiItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const observerTarget = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const requestReviews = useCallback(async (): Promise<ReviewApiItem[]> => {
    const response = await fetch("/api/mypage/reviews", {
      method: "GET",
      cache: "no-store",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.message ?? "작성한 리뷰를 불러오지 못했습니다.",
      );
    }

    return Array.isArray(result?.data) ? result.data : [];
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      try {
        const data = await requestReviews();

        if (cancelled) return;

        setReviews(data);
        setVisibleCount(PAGE_SIZE);
        setErrorMessage("");
      } catch (error) {
        if (cancelled) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "작성한 리뷰를 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      cancelled = true;
    };
  }, [requestReviews]);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await requestReviews();

      setReviews(data);
      setVisibleCount(PAGE_SIZE);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "작성한 리뷰를 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [requestReviews]);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  useEffect(() => {
    const target = observerTarget.current;
    const root = scrollContainerRef.current;

    if (!target || !root || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, reviews.length),
          );
        }
      },
      {
        root,
        rootMargin: "100px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, reviews.length, visibleCount]);

  const handleEdit = async (review: ReviewApiItem): Promise<void> => {
    if (processingIds.includes(review.id)) return;

    setErrorMessage("");
    setProcessingIds((prev) => [...prev, review.id]);

    try {
      const updatedReview = await updateReview(review.teamId, review.id, {
        score: review.score,
        comment: review.comment,
      });

      setReviews((prev) =>
        prev.map((item) =>
          item.id === updatedReview.id ? updatedReview : item,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "리뷰 수정에 실패했습니다.";

      setErrorMessage(message);
      throw error;
    } finally {
      setProcessingIds((prev) =>
        prev.filter((id) => id !== review.id),
      );
    }
  };

  const handleDelete = async (review: ReviewApiItem): Promise<void> => {
    if (processingIds.includes(review.id)) return;

    const confirmed = window.confirm("이 리뷰를 삭제하시겠어요?");
    if (!confirmed) return;

    setErrorMessage("");
    setProcessingIds((prev) => [...prev, review.id]);

    try {
      await deleteReview(review.teamId, review.id);

      setReviews((prev) =>
  prev.filter((item) => item.id !== review.id),
);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "리뷰 삭제에 실패했습니다.",
      );
    } finally {
      setProcessingIds((prev) =>
        prev.filter((id) => id !== review.id),
      );
    }
  };

  if (isLoading && reviews.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">
        불러오는 중...
      </p>
    );
  }

  if (errorMessage && reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p role="alert" className="text-red-500">
          {errorMessage}
        </p>

        <button
          type="button"
          className="mt-3 text-sm underline"
          onClick={() => void fetchReviews()}
        >
          다시 시도
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
      className="h-[780px] w-full overflow-y-auto rounded-[24px] bg-white px-5 py-6 sm:px-6 md:px-8"
    >
      {errorMessage && (
        <p role="alert" className="mb-4 text-sm text-red-500">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-6">
        {visibleReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            showEditButton
            showDeleteAction
            isProcessing={processingIds.includes(review.id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {hasMore && (
        <>
          <div
            ref={observerTarget}
            className="h-2"
            aria-hidden="true"
          />
          <p className="py-4 text-center text-sm text-gray-500">
            스크롤하면 더 많은 리뷰를 볼 수 있어요.
          </p>
        </>
      )}

      {isLoading && (
        <p className="py-4 text-center text-sm text-gray-500">
          불러오는 중...
        </p>
      )}
    </div>
  );
}