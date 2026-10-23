"use client";

import { X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import Button from "@/components/ui/Button/Button";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import Label from "@/components/ui/Form/label/Label";
import { useProfileDialog } from "../hooks/useProfileDialog";
import styles from "./ProfileActions.module.css";

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
  const dialogRef = useRef<HTMLElement>(null);
  useProfileDialog(dialogRef, true, false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
      const croppedFile = await createCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
      );
      if (mountedRef.current) onApply(croppedFile);
    } catch {
      if (mountedRef.current) {
        setError("이미지를 처리하지 못했습니다. 다시 시도하거나 다른 사진을 선택해주세요.");
      }
    } finally {
      if (mountedRef.current) setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto px-4 py-4">
      <button
        type="button"
        aria-label="이미지 편집 닫기"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-black/60"
      />

      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-crop-title"
        className="
          relative z-10 max-h-[calc(100dvh-32px)] w-full max-w-[520px] overflow-y-auto
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

          <IconButton
            size="sm"
            onClick={onCancel}
            aria-label="이미지 편집 닫기"
            className={`${styles.icon} cursor-pointer text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
          >
            <X size={22} aria-hidden="true" />
          </IconButton>
        </div>

        <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gray-900 sm:h-[360px]">
          <Cropper
            image={imageSrc}
            mediaProps={{ onError: () => setError("이미지를 읽지 못했습니다. 다른 사진을 선택해주세요.") }}
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
          <Label htmlFor="profile-image-zoom" className="sr-only">
            이미지 확대 비율
          </Label>
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

        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        <div className={`${styles.actions} mt-6`}>
          <Button type="button" variant="secondary" onClick={onCancel}
            className={`${styles.button} ${styles.secondary}`}>
            취소
          </Button>
          <Button type="button" onClick={handleApply}
            disabled={!croppedAreaPixels || isApplying}
            className={`${styles.button} ${styles.primary}`}>
            {isApplying ? "적용 중..." : "적용"}
          </Button>
        </div>
      </section>
    </div>
  );
}
