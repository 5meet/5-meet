"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageUploadFieldProps {
  value: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export const ImageUploadField = ({
  value,
  onFileSelect,
  onRemove,
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setPreviewUrl(value);
  }

  // 이미지 업로드
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    onFileSelect(file);
  };

  // 이미지 삭제
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl("");
    if (inputRef.current) inputRef.current.value = "";
    onRemove();
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative flex h-29 w-29 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-[#F9FAFB] md:h-37 md:w-37"
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
            alt="모임 이미지 미리보기"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/ic_image_plus.svg"
              alt="모임 이미지"
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
