import Image from "next/image";
import { CircleUserRound } from "lucide-react";

import { HeartRating } from "@/components/ui/HeartRating/HeartRating";
import type { Review } from "@/data/reviews";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({
  review,
}: ReviewCardProps) {
  return (
    <article
      className="
        grid
        grid-cols-1
        gap-5
        rounded-[23px]
        bg-white
        pb-[30px]

        md:grid-cols-[180px_1fr]
        md:gap-[30px]
      "
    >
      {/* 이미지 */}
      <div
        className="
          relative
          h-[180px]
          w-[180px]
          overflow-hidden
          rounded-[16px]
          bg-[#eeeae8]
        "
      >
        {review.imageUrl && (
          <Image
            src={review.imageUrl}
            alt=""
            fill
            sizes="180px"
            className="object-cover"
          />
        )}
      </div>

      {/* 리뷰 내용 */}
      <div
        className="
          flex
          min-w-0
          flex-col

          md:h-[180px]
        "
      >
        {/* 별점 + 작성자 */}
        <div>
          <HeartRating
            rating={review.rating}
            size="md"
          />

          <div
            className="
              mt-2
              flex
              items-center
              gap-1.5
              text-[13px]
              text-[#a1a4aa]
            "
          >
            <CircleUserRound
              size={22}
              strokeWidth={1.5}
              className="text-[#c8c8c8]"
            />

            <span>{review.authorName}</span>

            <time>{review.createdAt}</time>
          </div>
        </div>

        {/* 리뷰 내용 + 모임 정보 */}
        <div className="mt-auto">
          <p
            className="
              mb-2
              break-keep
              text-[16px]
              leading-[1.5]
              tracking-[-0.2px]
              text-[#4c5360]
            "
          >
            {review.content}
          </p>

          <div
            className="
              flex
              gap-1.5
              text-[13px]
              text-[#a3a5aa]
            "
          >
            <span>{review.groupName}</span>
            <span>·</span>
            <span>{review.category}</span>
          </div>

          {/* 오른쪽 콘텐츠 하단 구분선 */}
          <div
            className="
              mt-4
              w-full
              border-b
              border-[#e2e2e2]
            "
          />
        </div>
      </div>
    </article>
  );
}