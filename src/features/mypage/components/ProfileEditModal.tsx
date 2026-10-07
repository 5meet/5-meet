"use client";

import Image from "next/image";
import { Pencil, X } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import ProfileImageCropper from "./ProfileImageCropper";

interface ProfileEditModalProps {
  isOpen: boolean;
  name: string;
  email: string;
  imageSrc?: string;
  onClose: () => void;
  onSubmit?: (name: string, imageFile?: File) => void;
}

type ProfileEditModalContentProps = Omit<
  ProfileEditModalProps,
  "isOpen"
>;

function ProfileEditModalContent({
  name,
  email,
  imageSrc = "/profile/profile_female1.svg",
  onClose,
  onSubmit,
}: ProfileEditModalContentProps) {
  const [editedName, setEditedName] = useState(name);
  const [previewImageSrc, setPreviewImageSrc] = useState(imageSrc);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const pendingObjectUrlRef = useRef<string | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (cropImageSrc) {
        if (pendingObjectUrlRef.current) {
          URL.revokeObjectURL(pendingObjectUrlRef.current);
          pendingObjectUrlRef.current = null;
        }

        setCropImageSrc(null);
        return;
      }

      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [cropImageSrc, onClose]);

  useEffect(() => {
    return () => {
      if (pendingObjectUrlRef.current) {
        URL.revokeObjectURL(pendingObjectUrlRef.current);
      }

      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  const clearPendingImage = () => {
    if (pendingObjectUrlRef.current) {
      URL.revokeObjectURL(pendingObjectUrlRef.current);
      pendingObjectUrlRef.current = null;
    }

    setCropImageSrc(null);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    clearPendingImage();

    const nextImageSrc = URL.createObjectURL(file);
    pendingObjectUrlRef.current = nextImageSrc;
    setCropImageSrc(nextImageSrc);

    event.target.value = "";
  };

  const handleCropApply = (croppedFile: File) => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
    }

    const nextPreviewUrl = URL.createObjectURL(croppedFile);
    previewObjectUrlRef.current = nextPreviewUrl;

    setSelectedImageFile(croppedFile);
    setPreviewImageSrc(nextPreviewUrl);
    clearPendingImage();
  };

  const handleSubmit = () => {
    const trimmedName = editedName.trim();

    if (!trimmedName) return;

    onSubmit?.(trimmedName, selectedImageFile ?? undefined);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <button
          type="button"
          aria-label="프로필 수정 닫기"
          onClick={onClose}
          className="absolute inset-0 cursor-default bg-black/50"
        />

        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-edit-title"
          className="
            relative z-10 w-full max-w-[343px]
            rounded-3xl bg-white px-6 pb-6 pt-8
            shadow-[0_0_50px_rgba(0,0,0,0.08)]
            sm:max-w-[544px] sm:rounded-[40px] sm:p-12
          "
        >
          <div className="flex flex-col gap-10 sm:gap-12">
            <div className="flex items-center justify-between">
              <h2
                id="profile-edit-title"
                className="
                  text-lg font-semibold leading-7 tracking-[-0.36px] text-[#111827]
                  sm:text-2xl sm:leading-8 sm:tracking-[-0.48px]
                "
              >
                프로필 수정하기
              </h2>

              <button
                type="button"
                onClick={onClose}
                aria-label="프로필 수정 닫기"
                className="
                  flex h-6 w-6 cursor-pointer items-center justify-center
                  text-gray-700
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                "
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-8 sm:gap-12">
              <div className="flex justify-center">
                <div className="relative h-[119px] w-[116px]">
                  <div className="relative h-[114px] w-[114px] overflow-hidden rounded-full">
                    <Image
                      src={previewImageSrc}
                      alt=""
                      fill
                      sizes="114px"
                      className="object-cover"
                      unoptimized={previewImageSrc.startsWith("blob:")}
                    />
                  </div>

                  <label
                    htmlFor="profile-image"
                    aria-label="프로필 이미지 변경"
                    className="
                      absolute bottom-0 right-0
                      flex h-10 w-10 cursor-pointer items-center justify-center
                      rounded-full border border-gray-200 bg-white text-gray-700
                      focus-within:ring-2 focus-within:ring-primary-500
                    "
                  >
                    <Pencil size={24} aria-hidden="true" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="profile-name"
                    className="px-1 text-sm font-medium leading-5 tracking-[-0.28px] text-gray-800"
                  >
                    이름
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    value={editedName}
                    onChange={(event) => setEditedName(event.target.value)}
                    className="
                      h-10 w-full rounded-[10px] border-0 bg-[#f9fafb]
                      px-3 text-sm leading-5 tracking-[-0.28px] text-gray-800
                      outline-none
                      focus:ring-2 focus:ring-primary-500
                      sm:h-12 sm:rounded-xl sm:text-base sm:leading-6 sm:tracking-[-0.32px]
                    "
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="px-1 text-sm font-medium leading-5 tracking-[-0.28px] text-gray-800">
                    이메일
                  </span>

                  <div
                    className="
                      flex h-10 w-full items-center rounded-[10px] bg-[#f9fafb]
                      px-3 text-sm leading-5 tracking-[-0.28px] text-gray-800
                      sm:h-12 sm:rounded-xl sm:text-base sm:leading-6 sm:tracking-[-0.32px]
                    "
                  >
                    {email}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onClose}
                className="
                  flex h-12 flex-1 items-center justify-center
                  rounded-xl border border-gray-200 bg-white
                  px-6 text-base font-semibold leading-6 tracking-[-0.32px] text-gray-600
                  transition-colors hover:border-gray-300
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                  sm:h-[60px] sm:rounded-2xl sm:px-[30px] sm:text-xl sm:leading-[30px] sm:tracking-[-0.4px]
                "
              >
                취소
              </button>

              <button
                type="button"
                disabled={!editedName.trim()}
                onClick={handleSubmit}
                className="
                  flex h-12 flex-1 items-center justify-center
                  rounded-xl bg-primary-500
                  px-6 text-base font-semibold leading-6 tracking-[-0.32px] text-white
                  transition-colors hover:bg-primary-600
                  disabled:cursor-not-allowed disabled:opacity-40
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                  sm:h-[60px] sm:rounded-2xl sm:px-[30px] sm:text-xl sm:leading-[30px] sm:tracking-[-0.4px]
                "
              >
                수정하기
              </button>
            </div>
          </div>
        </section>
      </div>

      {cropImageSrc && (
        <ProfileImageCropper
          imageSrc={cropImageSrc}
          onCancel={clearPendingImage}
          onApply={handleCropApply}
        />
      )}
    </>
  );
}

export default function ProfileEditModal({
  isOpen,
  ...props
}: ProfileEditModalProps) {
  if (!isOpen) return null;

  return <ProfileEditModalContent {...props} />;
}
