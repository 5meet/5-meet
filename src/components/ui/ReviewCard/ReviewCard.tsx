import Image from "next/image";
import { CircleUserRound } from "lucide-react";

import { HeartRating } from "@/components/ui/HeartRating/HeartRating";

import type {
  ReviewApiItem,
} from "@/features/reviews/types";

interface ReviewCardProps {
  review: ReviewApiItem;
}

export function ReviewCard({
  review,
}: ReviewCardProps) {
  const meeting = review.meeting;
  const user = review.user;

  const createdAt = review.createdAt
    ? new Date(
        review.createdAt,
      ).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

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
      {/* 모임 이미지 */}
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
        {meeting?.image && (
          <Image
            src={meeting.image}
            alt={meeting.name ?? "모임 이미지"}
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
            rating={review.score}
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

            <span>
              {user?.name ?? "익명"}
            </span>

            <time dateTime={review.createdAt}>
              {createdAt}
            </time>
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
            {review.comment}
          </p>

          <div
            className="
              flex
              gap-1.5
              text-[13px]
              text-[#a3a5aa]
            "
          >
            <span>
              {meeting?.name ?? "모임 정보 없음"}
            </span>

            <span>·</span>

            <span>
              {meeting?.type ?? ""}
            </span>
          </div>

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