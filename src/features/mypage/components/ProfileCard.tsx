"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ProfileEditModal from "./ProfileEditModal";

interface ProfileCardProps {
  name?: string;
  email?: string;
  imageSrc?: string;
}

export default function ProfileCard({
  name = "럽윈즈올",
  email = "lovewins@codeit.com",
  imageSrc = "/profile/profile_female1.svg",
}: ProfileCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState(name);
  const [profileImageSrc, setProfileImageSrc] = useState(imageSrc);
  const localPreviewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }
    };
  }, []);

  const handleSubmit = (nextName: string, nextImageFile?: File) => {
    setDisplayName(nextName);

    if (nextImageFile) {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }

      const nextImageSrc = URL.createObjectURL(nextImageFile);
      localPreviewUrlRef.current = nextImageSrc;
      setProfileImageSrc(nextImageSrc);
    }

    setIsEditOpen(false);
  };

  return (
    <>
      <section
        aria-label="내 프로필"
        className="
          w-full rounded-3xl border border-primary-400 bg-mint-gradient-100
          p-4
          sm:h-[162px] sm:p-6
          lg:h-[294px] lg:w-[282px] lg:px-6 lg:py-10
        "
      >
        <div
          className="
            flex h-full items-center gap-6
            lg:flex-col lg:justify-start lg:gap-6
          "
        >
          <div
            className="
              relative h-[54px] w-[54px] shrink-0 overflow-hidden rounded-full
              sm:h-[114px] sm:w-[114px]
            "
          >
            <Image
              src={profileImageSrc}
              alt=""
              fill
              sizes="(min-width: 640px) 114px, 54px"
              className="object-cover"
              unoptimized={profileImageSrc.startsWith("blob:")}
            />
          </div>

          <div
            className="
              flex min-w-0 flex-col gap-2
              sm:gap-4
              lg:items-center
            "
          >
            <div className="flex items-center pl-2 lg:justify-center">
              <p
                className="
                  truncate text-sm font-semibold leading-5 tracking-[-0.28px] text-gray-800
                  sm:text-lg sm:leading-7 sm:tracking-[-0.36px]
                "
              >
                {displayName}
              </p>

              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                aria-label="프로필 수정"
                className="
                  flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center
                  rounded-full text-gray-700
                  transition-colors hover:bg-white/60
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                "
              >
                <Pencil size={18} aria-hidden="true" />
              </button>
            </div>

            <p
              className="
                max-w-full truncate rounded-3xl bg-mint-gradient-200
                px-3 py-1.5
                text-sm font-medium leading-5 text-gray-600
              "
            >
              {email}
            </p>
          </div>
        </div>
      </section>

      <ProfileEditModal
        isOpen={isEditOpen}
        name={displayName}
        email={email}
        imageSrc={profileImageSrc}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
