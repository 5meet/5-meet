"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { HeartRating } from "@/components/ui/HeartRating/HeartRating";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";

import ReviewWriteModal from "./ReviewWriteModal";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";

export interface ReviewMeetingCardProps {
  imageUrl: string;
  title: string;
  location: string;
  date: string;
  time: string;
  participantCount: number;
  capacity: number;
  isFavorite?: boolean;
  rating?: number;
}

export default function ReviewMeetingCard({
  imageUrl,
  title,
  location,
  date,
  time,
  participantCount,
  capacity,
  isFavorite = false,
  rating,
}: ReviewMeetingCardProps) {
  const [isLiked, setIsLiked] = useState(isFavorite);
  const [isReviewModalOpen, setIsReviewModalOpen] =
    useState(false);

  const handleFavoriteClick = () => {
    setIsLiked((prev) => !prev);
  };

  const handleReviewClick = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (
    rating: number,
    content: string,
  ) => {
    console.log("리뷰 등록", {
      rating,
      content,
    });

    setIsReviewModalOpen(false);
  };

  
  return (
    <>
      <article
        className="
          flex
          w-full
          min-w-0
          flex-col
          overflow-hidden
          rounded-[24px]
          border
          border-[#eeeeee]
          bg-white
          p-5

          md:h-[210px]
          md:flex-row
          md:gap-6
          md:p-4
        "
      >
        {/* 모임 이미지 */}
        <div
          className="
            relative
            h-[220px]
            w-full
            shrink-0
            overflow-hidden
            rounded-[18px]
            bg-[#eeeae8]

            sm:h-[250px]

            md:h-[178px]
            md:w-[178px]
            md:rounded-[18px]
          "
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="
              (max-width: 767px) 100vw,
              178px
            "
            className="object-cover"
          />
        </div>

        {/* 카드 내용 */}
        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
            pt-5

            md:h-full
            md:pt-0
          "
        >
          {/* 제목 + 찜 */}
          <div
            className="
              flex
              min-w-0
              items-start
              justify-between
              gap-4
            "
          >
            <div className="min-w-0">
              <h3
                className="
                  truncate
                  text-[18px]
                  font-bold
                  tracking-[-0.2px]
                  text-[#20242d]

                  sm:text-[19px]

                  md:text-[18px]
                "
              >
                {title}
              </h3>

              {/* 별점 */}
              {rating !== undefined && (
                <div className="mt-2">
                  <HeartRating
                    rating={rating}
                    size="md"
                  />
                </div>
              )}
            </div>

            {/* 찜 */}
            <LikeButton
              isLiked={isLiked}
              onClick={handleFavoriteClick}
            />
          </div>

          {/* 하단 정보 + 리뷰 작성 */}
          <div
            className="
              mt-7
              flex
              flex-col
              gap-5

              md:mt-auto
              md:flex-row
              md:items-end
              md:justify-between
              md:gap-5
            "
          >
            {/* 모임 정보 */}
            <div className="min-w-0">
              {/* 참여 인원 */}
              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[14px]
                  font-medium
                  text-[#20242d]

                  sm:text-[15px]

                  md:text-[14px]
                "
              >
                <Users
                  size={17}
                  fill="currentColor"
                  strokeWidth={0}
                  className="text-[#999999]"
                />

                <span>
                  {participantCount}/{capacity}
                </span>
              </div>

              {/* 위치 / 날짜 / 시간 */}
              <div
                className="
                  mt-2
                  flex
                  flex-wrap
                  items-center
                  gap-x-2
                  gap-y-1
                  text-[13px]
                  text-[#888b90]

                  sm:text-[14px]

                  md:text-[13px]
                "
              >
                <span>
                  위치 {location}
                </span>

                <span className="text-[#d2d2d2]">
                  |
                </span>

                <span>
                  날짜 {date}
                </span>

                <span className="text-[#d2d2d2]">
                  |
                </span>

                <span>
                  시간 {time}
                </span>
              </div>
            </div>

            {/* 리뷰 작성 */}
            <Button
              type="button"
              size="md"
              variant="primary"
              onClick={handleReviewClick}
              className="
                h-12
                w-full
                shrink-0
                rounded-[9px]
                px-7
                text-[15px]
                font-semibold

                sm:w-auto
                sm:px-9

                md:h-[44px]
                md:px-8
                md:text-[14px]
              "
            >
              리뷰 작성하기
            </Button>
          </div>
        </div>
      </article>

      {/* 리뷰 작성 모달 */}
      <ReviewWriteModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
}