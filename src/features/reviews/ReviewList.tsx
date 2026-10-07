import Image from "next/image";

import type { Review } from "@/data/reviews";
import { ReviewCard } from "../../components/ui/ReviewCard/ReviewCard";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({
  reviews,
}: ReviewListProps) {
  if (reviews.length === 0) {
  return <EmptyState message="아직 리뷰가 없어요" />;
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
      {reviews.map((review, index) => (
        <div key={review.id}>
          <ReviewCard review={review} />

          {index < reviews.length - 1 && (
            <div/>
          )}
        </div>
      ))}
    </section>
  );
}