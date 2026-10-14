"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";
import { createReview } from "@/features/reviews/api/createReview";
import { updateReview } from "@/features/reviews/api/updateReview";

interface ReviewWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string;
  meetingId?: number;
  reviewId?: number;
  mode?: "create" | "edit";
  initialRating?: number;
  initialContent?: string;
  onSuccess?: () => void | Promise<void>;
  onSubmit?: (rating: number, content: string) => void | Promise<void>;
  title?: string;
}

export default function ReviewWriteModal({
  isOpen,
  onClose,
  teamId,
  meetingId,
  reviewId,
  mode = "create",
  initialRating = 0,
  initialContent = "",
  onSuccess,
  onSubmit,
  title,
}: ReviewWriteModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setRating(initialRating);
    setContent(initialContent);
  }, [isOpen, initialRating, initialContent]);

  const resetForm = () => {
    setRating(mode === "edit" ? initialRating : 0);
    setContent(mode === "edit" ? initialContent : "");
  };

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const trimmedContent = content.trim();

    if (rating === 0) {
      alert("별점을 선택해 주세요.");
      return;
    }

    if (!trimmedContent) {
      alert("리뷰 내용을 입력해 주세요.");
      return;
    }

    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(rating, trimmedContent);
        resetForm();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (
      !teamId ||
      !Number.isFinite(meetingId) ||
      (mode === "edit" && reviewId === undefined)
    ) {
      alert("팀, 모임 또는 리뷰 정보가 올바르지 않습니다.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === "edit") {
        await updateReview(teamId, reviewId!, {
          score: rating,
          comment: trimmedContent,
        });
        alert("리뷰 수정이 완료되었습니다.");
      } else {
        await createReview(teamId, meetingId!, {
          score: rating,
          comment: trimmedContent,
        });
        alert("리뷰 작성이 완료되었습니다.");
      }

      resetForm();
      onClose();

      try {
        await onSuccess?.();
      } catch (error) {
        console.error("[리뷰] 목록 갱신 실패:", error);
      }
    } catch (error) {
      console.error("[리뷰] 저장 실패:", error);
      alert(
        error instanceof Error
          ? error.message
          : "리뷰 저장에 실패했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <Modal.Header onClose={handleClose}>
        <Modal.Title>
          {title ?? (mode === "edit" ? "리뷰 수정하기" : "리뷰 쓰기")}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-10">
          <section>
            <p className="text-lg font-medium text-gray-800">
              만족스러운 경험이었나요?
              <span className="ml-1 text-primary-500">*</span>
            </p>

            <div className="mt-6 flex gap-2">
              {Array.from({ length: 5 }, (_, index) => {
                const heartRating = index + 1;
                const isActive = heartRating <= rating;

                return (
                  <button
                    key={heartRating}
                    type="button"
                    onClick={() => setRating(heartRating)}
                    aria-label={`${heartRating}점`}
                    aria-pressed={isActive}
                    disabled={isSubmitting}
                    className="cursor-pointer transition-transform hover:scale-105 disabled:cursor-not-allowed"
                  >
                    <Heart
                      size={52}
                      strokeWidth={0}
                      fill="currentColor"
                      className={
                        isActive ? "text-primary-500" : "text-gray-200"
                      }
                    />
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <label
              htmlFor="review-content"
              className="text-lg font-medium text-gray-800"
            >
              좋았던 점을 자유롭게 적어주세요.
              <span className="ml-1 text-primary-500">*</span>
            </label>

            <textarea
              id="review-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="남겨주신 리뷰는 프로그램 운영 및 다른 회원 분들께 큰 도움이 됩니다."
              disabled={isSubmitting}
              className="
                mt-3 h-48 w-full resize-none rounded-2xl
                border-0 bg-gray-100 px-5 py-4 text-sm
                text-gray-800 outline-none placeholder:text-gray-400
                focus:ring-2 focus:ring-primary-500
                disabled:cursor-not-allowed disabled:opacity-60
              "
            />
          </section>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={handleClose}
          disabled={isSubmitting}
          className="flex-1 border-gray-300 text-gray-500"
        >
          취소
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={rating === 0 || !content.trim() || isSubmitting}
          onClick={handleSubmit}
          className="flex-1"
        >
          {isSubmitting
            ? mode === "edit"
              ? "수정 중..."
              : "등록 중..."
            : mode === "edit"
              ? "수정 완료"
              : "확인"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}