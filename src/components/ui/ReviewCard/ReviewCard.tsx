"use client";

import { useState } from "react";
import Image from "next/image";
import { CircleUserRound } from "lucide-react";

import Button from "@/components/ui/Button/Button";
import ReviewWriteModal from "@/features/mypage/components/ReviewWriteModal";
import { HeartRating } from "@/components/ui/HeartRating/HeartRating";
import type { ReviewApiItem } from "@/features/reviews/types";
import type { MyReview } from "@/features/mypage/api/getMyReviews";

type ReviewCardItem = ReviewApiItem | MyReview;

interface ReviewCardProps {
  review: ReviewCardItem;
  showEditButton?: boolean;
  showDeleteAction?: boolean;
  isProcessing?: boolean;
  onEdit?: (review: ReviewCardItem) => Promise<void> | void;
  onDelete?: (review: ReviewCardItem) => Promise<void> | void;
}

export function ReviewCard({
  review,
  showEditButton = false,
  showDeleteAction = false,
  isProcessing = false,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editError, setEditError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const meeting = review.meeting;

  const createdAt = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  const handleSubmitEdit = async (rating: number, content: string) => {
    if (!onEdit || isProcessing) return;

    setEditError("");

    try {
      await onEdit({
        ...review,
        score: rating,
        comment: content.trim(),
      });

      setIsEditModalOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "리뷰 수정에 실패했습니다.";

      setEditError(message);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!onDelete || isProcessing || isDeleting) return;

    setDeleteError("");
    setIsDeleting(true);

    try {
      await onDelete(review);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "리뷰 삭제에 실패했습니다. 다시 시도해 주세요.";

      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <article
        className="
          grid grid-cols-1 items-stretch gap-5
          rounded-[23px] bg-white pb-7
          md:grid-cols-[200px_minmax(0,1fr)] md:gap-6
        "
      >
        <div
          className="
            relative h-[180px] w-full overflow-hidden
            rounded-[16px] bg-[#eeeae8]
            md:h-[180px] md:w-[180px]
          "
        >
          {meeting?.image && (
            <Image
              src={meeting.image}
              alt={meeting.name ?? "모임 이미지"}
              fill
              sizes="(min-width: 768px) 180px, 100vw"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <HeartRating rating={review.score} size="md" />

              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px] text-[#a1a4aa]">
                <CircleUserRound
                  size={24}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#c8c8c8]"
                />
                <span>{review.user?.name ?? "익명"}</span>
                <time dateTime={review.createdAt}>{createdAt}</time>
              </div>
            </div>

            {showEditButton && (
              <Button
                type="button"
                variant="primary"
                size="md"
                fullWidth={false}
                disabled={isProcessing || isDeleting}
                onClick={() => {
                  setEditError("");
                  setIsEditModalOpen(true);
                }}
                className="
                  !h-[44px] !w-auto min-w-[140px] shrink-0
                  rounded-[12px] px-5 text-[14px] font-semibold
                "
              >
                수정하기
              </Button>
            )}
          </div>

          <div className="mt-auto pt-6">
            <p className="break-keep text-[16px] leading-[1.6] tracking-[-0.2px] text-[#4c5360]">
              {review.comment}
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-[13px] text-[#a3a5aa]">
                <span>{meeting?.name ?? "모임 정보 없음"}</span>
                {meeting?.type && (
                  <>
                    <span>·</span>
                    <span>{meeting.type}</span>
                  </>
                )}
              </div>

              {showDeleteAction && (
                <button
                  type="button"
                  disabled={isProcessing || isDeleting}
                  onClick={() => void handleDelete()}
                  className="
                    shrink-0 cursor-pointer text-[13px] font-medium
                    text-[#a1a4aa] transition-colors hover:text-red-500
                    focus-visible:outline-none focus-visible:underline
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                >
                  {isDeleting ? "삭제 중..." : "삭제하기"}
                </button>
              )}
            </div>

            {deleteError && (
              <p role="alert" className="mt-2 text-sm text-red-500">
                {deleteError}
              </p>
            )}

            <div className="mt-3 w-full border-b border-[#e2e2e2]" />
          </div>
        </div>
      </article>

      <ReviewWriteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditError("");
        }}
        teamId={review.teamId}
        meetingId={review.meetingId}
        reviewId={review.id}
        mode="edit"
        initialRating={review.score}
        initialContent={review.comment}
        onSubmit={handleSubmitEdit}
      />

      {editError && !isEditModalOpen && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {editError}
        </p>
      )}
    </>
  );
}

export default ReviewCard;