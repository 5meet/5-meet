import Image from "next/image";
import { CircleUserRound } from "lucide-react";

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
        gap-0
        border-b
        border-[#e2e2e2]
        rounded-[23px]
        bg-white
        px-5
        py-5

        last:mb-0

        md:grid-cols-[190px_1fr]
        md:gap-5
        md:px-[30px]
        md:py-[30px]
      "
    >
      <div
        className="
          order-1

          md:col-start-2
          md:row-start-1
        "
      >
        <div className="mb-1 mt-5 flex gap-0.5">
          {[1, 2, 3, 4, 5].map((heart) => (
            <span
              key={heart}
              className={`
                text-[25px]
                leading-none

                ${
                  heart <= review.rating
                    ? "text-[#08b88a]"
                    : "text-[#d0d8d9]"
                }
              `}
            >
              ♥
            </span>
          ))}
        </div>

        <div
          className="
            mb-3
            flex
            items-center
            gap-1.5
            text-[12px]
            text-[#a1a4aa]
          "
        >
          <CircleUserRound
            size={20}
            strokeWidth={1.5}
            className="text-[#c8c8c8]"
          />

          <span>{review.authorName}</span>

          <time>{review.createdAt}</time>
        </div>
      </div>

      <div
        className="
          order-2
          relative
          mb-4
          h-[190px]
          w-full
          overflow-hidden
          rounded-[18px]
          bg-[#eeeae8]

          md:col-start-1
          md:row-span-2
          md:row-start-1
          md:mb-0
          md:h-[180px]
          md:w-[180px]
          md:rounded-[20px]
        "
      >
        {review.imageUrl && (
          <Image
            src={review.imageUrl}
            alt=""
            fill
            className="object-cover"
          />
        )}
      </div>
      
      <div
        className="
          order-3

          md:col-start-2
          md:row-start-1
          md:pt-[76px]
        "
      >
        <p
          className="
            mb-2
            text-[14px]
            leading-[1.65]
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
            text-[11px]
            text-[#a3a5aa]
          "
        >
          <span>{review.groupName}</span>
          <span>·</span>
          <span>{review.category}</span>
        </div>
      </div>
    </article>
  );
}