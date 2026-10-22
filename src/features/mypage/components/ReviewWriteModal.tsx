
"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";

interface ReviewWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (
    rating: number,
    content: string,
  ) => void | Promise<void>;
}

export default function ReviewWriteModal({
  isOpen,
  onClose,
  onSubmit,
}: ReviewWriteModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;

    setRating(0);
    setContent("");
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

    if (!onSubmit) {
      alert("리뷰 작성 기능을 사용할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(rating, trimmedContent);

      setRating(0);
      setContent("");
      onClose();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "리뷰 등록에 실패했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
    >
      <Modal.Header onClose={handleClose}>
        <Modal.Title>리뷰 작성</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-10">
          <section>
            <p className="text-lg font-medium text-gray-800">
              모임에서의 경험은 어땠나요?
              <span className="ml-1 text-primary-500">
                *
              </span>
            </p>

            <div className="mt-6 flex gap-2">
              {Array.from({ length: 5 }, (_, index) => {
                const star = index + 1;
                const isActive = star <= rating;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    disabled={isSubmitting}
                    aria-label={`${star}점`}
                    aria-pressed={isActive}
                    className="cursor-pointer transition-transform hover:scale-105 disabled:cursor-not-allowed"
                  >
                    <Heart
                      size={52}
                      strokeWidth={0}
                      fill="currentColor"
                      className={
                        isActive
                          ? "text-primary-500"
                          : "text-gray-200"
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
              좋았던 점이나 아쉬웠던 점을 자유롭게 적어 주세요.
              <span className="ml-1 text-primary-500">
                *
              </span>
            </label>

            <textarea
              id="review-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={isSubmitting}
              placeholder="모임 참여 경험이나 다른 회원들에게 전하고 싶은 내용을 작성해 주세요."
              className="
                mt-3
                h-48
                w-full
                resize-none
                rounded-2xl
                border-0
                bg-gray-100
                px-5
                py-4
                text-sm
                text-gray-800
                outline-none
                placeholder:text-gray-400
                focus:ring-2
                focus:ring-primary-500
                disabled:opacity-60
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
          disabled={
            rating === 0 ||
            !content.trim() ||
            isSubmitting
          }
          onClick={() => void handleSubmit()}
          className="flex-1"
        >
          {isSubmitting ? "등록 중..." : "확인"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
