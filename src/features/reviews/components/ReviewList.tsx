import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { ReviewCard } from "@/components/ui/ReviewCard/ReviewCard";

import type {
  ReviewApiItem,
} from "../types";

interface ReviewListProps {
  reviews: ReviewApiItem[];
}

export function ReviewList({
  reviews,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        message="아직 리뷰가 없어요"
      />
    );
  }

  return (
    <section
      className="
        rounded-t-[23px]
        bg-white
        px-7
        pt-7
      "
    >
      {reviews.map((review) => (
        <div key={review.id}>
          <ReviewCard
            review={review}
          />
        </div>
      ))}
    </section>
  );
}