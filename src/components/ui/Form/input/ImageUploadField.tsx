"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageUploadFieldProps {
  value: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  alt?: string;
}

const isBlobUrl = (url: string) => url.startsWith("blob:");

export const ImageUploadField = ({
  value,
  onFileSelect,
  onRemove,
  alt,
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    if (previewUrl && isBlobUrl(previewUrl) && previewUrl !== value) {
      URL.revokeObjectURL(previewUrl);
    }

    setPrevValue(value);
    setPreviewUrl(value);
  }

  // 컴포넌트가 사라질 때, 마지막까지 들고 있던 blob을 정리
  useEffect(() => {
    return () => {
      if (previewUrl && isBlobUrl(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 이미지 업로드
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl && isBlobUrl(previewUrl)) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
    onFileSelect(file);
  };

  // 이미지 삭제
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (previewUrl && isBlobUrl(previewUrl)) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");
    if (inputRef.current) inputRef.current.value = "";
    onRemove();
  };

  // 키보드 접근성
  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Space의 경우 페이지 스크롤 방지
      inputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        aria-label={previewUrl ? "모임 이미지 변경" : "모임 이미지 업로드"}
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleTriggerKeyDown}
        className="relative flex h-29 w-29 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-[#F9FAFB] border border-white md:h-37 md:w-37 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="이미지 삭제"
            className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black text-gray-50 cursor-pointer"
          >
            <X size={20} />
          </button>
        )}

        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={alt || "모임 이미지 미리보기"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/ic_image_plus.svg"
              alt="파일 첨부"
              width={24}
              height={24}
            />
            <span className="text-xs text-gray-500">파일 첨부</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};
