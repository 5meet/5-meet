"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Modal } from "@/components/ui/Modal/Modal";

interface ReviewWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (rating: number, content: string) => void;
}

export default function ReviewWriteModal({
  isOpen,
  onClose,
  onSubmit,
}: ReviewWriteModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const handleClose = () => {
    setRating(0);
    setContent("");
    onClose();
  };

  const handleSubmit = () => {
    if (rating === 0 || !content.trim()) return;

    onSubmit?.(rating, content.trim());

    setRating(0);
    setContent("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} size="xl">
      <Modal.Header onClose={handleClose}>
        <Modal.Title>리뷰 쓰기</Modal.Title>
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
                const star = index + 1;
                const isActive = star <= rating;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star}점`}
                    className="cursor-pointer transition-transform hover:scale-105"
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
              좋았던 점을 자유롭게 적어주세요.
              <span className="ml-1 text-primary-500">*</span>
            </label>

            <textarea
              id="review-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="남겨주신 리뷰는 프로그램 운영 및 다른 회원 분들께 큰 도움이 됩니다."
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
          className="flex-1 border-gray-300 text-gray-500"
        >
          취소
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={rating === 0 || !content.trim()}
          onClick={handleSubmit}
          className="flex-1"
        >
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}