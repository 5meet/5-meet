"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button/Button";
import { HeartRating } from "@/components/ui/HeartRating/HeartRating";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";
import { showToast } from "@/components/ui/Sonner";

import { createReview } from "@/features/reviews/api/createReview";
import { useAddFavoriteMutation } from "@/features/favorites/hook/useAddFavoriteMutation";
import { useDeleteFavoriteMutation } from "@/features/favorites/hook/useDeleteFavoriteMutation";

import ReviewWriteModal from "./ReviewWriteModal";

export interface ReviewMeetingCardProps {
  teamId: string;
  meetingId: number;
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
  teamId,
  meetingId,
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
  const queryClient = useQueryClient();

  const addFavoriteMutation = useAddFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const [isLiked, setIsLiked] = useState(isFavorite);
  const [isFavoritePending, setIsFavoritePending] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setIsLiked(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    setHasImageError(false);
  }, [imageUrl]);

  const hasImage = Boolean(imageUrl?.trim()) && !hasImageError;

  const handleFavoriteClick = async () => {
    if (isFavoritePending) return;

    const previousLiked = isLiked;
    const nextLiked = !previousLiked;

    setIsFavoritePending(true);
    setIsLiked(nextLiked);

    try {
      if (nextLiked) {
        await addFavoriteMutation.mutateAsync(meetingId);
      } else {
        await deleteFavoriteMutation.mutateAsync(meetingId);
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["mypage", "reviews", "available"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["favorites"],
        }),
      ]);

      showToast({
        kind: "success",
        message: nextLiked
          ? "찜 목록에 등록했습니다."
          : "찜을 취소했습니다.",
      });
    } catch (error) {
      setIsLiked(previousLiked);

      showToast({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "찜 상태를 변경하지 못했습니다.",
      });
    } finally {
      setIsFavoritePending(false);
    }
  };

  const handleReviewSubmit = async (
    reviewRating: number,
    content: string,
  ) => {
    await createReview(teamId, meetingId, {
      score: reviewRating,
      comment: content,
    });

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["mypage", "reviews", "available"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["mypage", "reviews", "written"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      }),
    ]);

    showToast({
      kind: "success",
      message: "리뷰가 등록되었습니다.",
    });
  };

  return (
    <>
      <article
        className="
          flex
          flex-col
          rounded-[20px]
          border
          border-[#eeeeee]
          bg-white
          p-5
          md:h-[210px]
          md:flex-row
          md:gap-6
        "
      >
        <div
          className="
            relative
            h-[200px]
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
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 767px) 100vw, 178px"
              className="object-cover"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              role="img"
              aria-label={`${title} 이미지 없음`}
            >
              <span className="text-sm text-[#999999]">
                이미지 없음
              </span>
            </div>
          )}
        </div>

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
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3
                className="
                  break-words
                  text-[17px]
                  font-bold
                  tracking-[-0.2px]
                  text-[#20242d]
                  sm:text-[19px]
                  md:text-[18px]
                "
              >
                {title}
              </h3>

              {rating !== undefined && (
                <div className="mt-2">
                  <HeartRating rating={rating} size="md" />
                </div>
              )}
            </div>

            <LikeButton
              isLiked={isLiked}
              onToggle={() => void handleFavoriteClick()}
              disabled={isFavoritePending}
              isLoading={isFavoritePending}
            />
          </div>

          <div
            className="
              flex
              flex-col
              gap-5
              md:mt-auto
              md:flex-row
              md:items-end
              md:justify-between
            "
          >
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex items-center gap-2 text-[14px] font-medium text-[#20242d] sm:text-[15px] md:text-[14px]">
                <Users size={17} />
                <span>
                  {participantCount}/{capacity}명 참여
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#888b90] sm:text-[14px] md:text-[13px]">
                <span>위치 {location}</span>
                <span className="text-[#d2d2d2]">|</span>
                <span>날짜 {date}</span>
                <span className="text-[#d2d2d2]">|</span>
                <span>시간 {time}</span>
              </div>
            </div>

            <Button
              type="button"
              size="md"
              variant="primary"
              onClick={() => setIsReviewModalOpen(true)}
              className="
                h-12
                w-full
                shrink-0
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
              리뷰 작성
            </Button>
          </div>
        </div>
      </article>

      <ReviewWriteModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
}
