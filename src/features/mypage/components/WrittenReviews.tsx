"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReviewApiItem } from "@/features/reviews/types";
import ReviewCard from "@/components/ui/ReviewCard/ReviewCard";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";

export default function WrittenReviews() {
  const [reviews, setReviews] = useState<ReviewApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/mypage/reviews?sortBy=createdAt&sortOrder=desc&size=10",
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`리뷰 조회 실패 (${response.status})`);
      }

      const result = await response.json();
      const apiReviews: ReviewApiItem[] = Array.isArray(result.data)
        ? result.data
        : [];

      setReviews(apiReviews);
    } catch (err) {
      console.error("리뷰 조회 오류:", err);
      setError("리뷰를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  if (loading) {
    return <p className="py-8 text-center">리뷰를 불러오는 중입니다...</p>;
  }

  if (error) {
    return (
      <div>
        <EmptyState message={error} />
        <div className="text-center">
          <button
            type="button"
            onClick={() => void fetchReviews()}
            className="rounded-md border px-4 py-2 text-sm"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return <EmptyState message="작성한 리뷰가 없습니다." />;
  }

  return (
    <div className="h-[70vh] min-h-[400px] overflow-y-auto overscroll-contain pr-3">
      <section className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </section>
    </div>
  );
}
