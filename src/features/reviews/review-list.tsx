import Image from "next/image";

import type { Review } from "@/data/reviews";
import { ReviewCard } from "./review-card";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({
  reviews,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <section
        className="
          flex
          min-h-[215px]
          items-center
          justify-center
          rounded-[23px]
          bg-white
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            text-center
          "
        >

          <div
            className="
              relative
              mb-4
              h-[66px]
              w-[100px]
            "
          >
            <Image
              src="/review_empty.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>

          <p
            className="
              text-[14px]
              font-medium
              text-[#a7aaad]
            "
          >
            아직 리뷰가 없어요
          </p>
        </div>
      </section>
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
      {reviews.map((review, index) => (
        <div key={review.id}>
          <ReviewCard review={review} />

          {index < reviews.length - 1 && (
            <div
              className="
                mx-7
                border-b
                border-[#e2e2e2]
              "
            />
          )}
        </div>
      ))}
    </section>
  );
}