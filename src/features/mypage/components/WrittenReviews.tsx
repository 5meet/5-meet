"use client";

import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import ReviewCard from "@/components/ui/ReviewCard/ReviewCard";

import { deleteReview } from "@/features/reviews/api/deleteReview";
import { updateReview } from "@/features/reviews/api/updateReview";
import type { ReviewApiItem } from "@/features/reviews/types";

export default function WrittenReviews() {
  const [reviews, setReviews] = useState<ReviewApiItem[]>([]);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/mypage/reviews", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ?? "작성한 리뷰를 불러오지 못했습니다.",
        );
      }

      setReviews(result.data ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "작성한 리뷰를 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

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
      setProcessingIds((prev) => prev.filter((id) => id !== review.id));
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

      setReviews((prev) => prev.filter((item) => item.id !== review.id));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "리뷰 삭제에 실패했습니다.",
      );
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== review.id));
    }
  };

  if (isLoading) {
    return <p className="py-8 text-center text-gray-500">불러오는 중...</p>;
  }

  if (errorMessage && reviews.length === 0) {
    return (
      <p role="alert" className="py-8 text-center text-red-500">
        {errorMessage}
      </p>
    );
  }

  if (reviews.length === 0) {
    return <EmptyState message="작성한 리뷰가 없어요." />;
  }

  return (
    <div className="h-[780px] w-full overflow-y-auto rounded-[24px] bg-white px-5 py-6 sm:px-6 md:px-8">
      {errorMessage && (
        <p role="alert" className="mb-4 text-sm text-red-500">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
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
    </div>
  );
}