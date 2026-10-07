"use client";

import { X, ZoomIn } from "lucide-react";
import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { createCroppedImageFile } from "../utils/cropImage";

interface ProfileImageCropperProps {
  imageSrc: string;
  onCancel: () => void;
  onApply: (file: File) => void;
}

export default function ProfileImageCropper({
  imageSrc,
  onCancel,
  onApply,
}: ProfileImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, nextCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(nextCroppedAreaPixels);
    },
    [],
  );

  const handleApply = async () => {
    if (!croppedAreaPixels || isApplying) return;

    try {
      setIsApplying(true);
      const croppedFile = await createCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
      );
      onApply(croppedFile);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="이미지 편집 닫기"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-black/60"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-crop-title"
        className="
          relative z-10 w-full max-w-[520px]
          rounded-3xl bg-white p-5 shadow-[0_0_50px_rgba(0,0,0,0.12)]
          sm:p-8
        "
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3
              id="profile-crop-title"
              className="text-lg font-semibold text-gray-900 sm:text-xl"
            >
              프로필 이미지 조정
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              이미지를 움직이거나 확대해서 원하는 영역을 맞춰주세요.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="이미지 편집 닫기"
            className="
              flex h-9 w-9 items-center justify-center rounded-full text-gray-700
              hover:bg-gray-100
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
            "
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gray-900 sm:h-[360px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            minZoom={1}
            maxZoom={3}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <ZoomIn
            size={20}
            className="shrink-0 text-gray-600"
            aria-hidden="true"
          />
          <label htmlFor="profile-image-zoom" className="sr-only">
            이미지 확대 비율
          </label>
          <input
            id="profile-image-zoom"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-primary-500"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="
              h-12 flex-1 rounded-xl border border-gray-200 bg-white
              text-base font-semibold text-gray-600
              hover:border-gray-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
            "
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!croppedAreaPixels || isApplying}
            className="
              h-12 flex-1 rounded-xl bg-primary-500
              text-base font-semibold text-white
              hover:bg-primary-600
              disabled:cursor-not-allowed disabled:opacity-40
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
              focus-visible:ring-offset-2
            "
          >
            {isApplying ? "적용 중..." : "적용"}
          </button>
        </div>
      </section>
    </div>
  );
}
