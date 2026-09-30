import Image from "next/image";

import { HeartRating } from "@/components/ui/HeartRating/HeartRating";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";

export interface WrittenReviewCardProps {
  imageUrl?: string;
  rating: number;
  nickname: string;
  date: string;
  content: string;
  meetingTitle: string;
  category: string;
  profileImageUrl?: string;
}

export default function WrittenReviewCard({
  imageUrl,
  rating,
  nickname,
  date,
  content,
  meetingTitle,
  category,
  profileImageUrl,
}: WrittenReviewCardProps) {
  return (
    <article className="border-b border-gray-200 py-5 last:border-b-0">
      {/* =========================
          PC
      ========================== */}
      <div className="hidden md:flex md:gap-8">
        {/* 모임 이미지 */}
        <div className="relative h-[180px] w-[180px] shrink-0 overflow-hidden rounded-[20px] bg-gray-100">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={meetingTitle}
              fill
              sizes="180px"
              className="object-cover"
            />
          )}
        </div>

        {/* 리뷰 내용 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 별점 */}
          <HeartRating
            rating={rating}
            size="md"
          />

          {/* 작성자 */}
          <div className="mt-2 flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              {profileImageUrl && (
                <Image
                  src={profileImageUrl}
                  alt={nickname}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              )}
            </div>

            <span className="text-sm text-gray-500">
              {nickname}
            </span>

            <span className="text-sm text-gray-400">
              {date}
            </span>
          </div>

          {/* 리뷰 내용 */}
          <p className="mt-7 break-keep text-[15px] leading-6 text-gray-700">
            {content}
          </p>

          {/* 모임 정보 */}
          <p className="mt-3 text-sm text-gray-400">
            {meetingTitle} · {category}
          </p>
        </div>
      </div>

      {/* =========================
          Mobile
      ========================== */}
      <div
        className="
          rounded-[22px]
          bg-white
          px-5
          py-6

          md:hidden
        "
      >
        {/* 별점 */}
        <HeartRating
          rating={rating}
          size="md"
        />

        {/* 작성자 */}
        <div
          className="
            mt-2
            flex
            items-center
            gap-1.5
            text-[12px]
            text-[#a3a5aa]

            sm:text-[13px]
          "
        >
          <div
            className="
              relative
              h-6
              w-6
              shrink-0
              overflow-hidden
              rounded-full
              bg-[#f0f0f0]
            "
          >
            {profileImageUrl && (
              <Image
                src={profileImageUrl}
                alt={nickname}
                fill
                sizes="24px"
                className="object-cover"
              />
            )}
          </div>

          <span>{nickname}</span>

          <span>{date}</span>
        </div>

        {/* 모임 이미지 */}
        <div
          className="
            relative
            mt-4
            h-[136px]
            w-full
            overflow-hidden
            rounded-[10px]
            bg-[#eeeeee]

            sm:h-[170px]
          "
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={meetingTitle}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>

        {/* 리뷰 내용 */}
        <p
          className="
            mt-4
            break-keep
            text-[14px]
            leading-[1.75]
            tracking-[-0.1px]
            text-[#4c5360]

            sm:text-[15px]
            sm:leading-6
          "
        >
          {content}
        </p>

        {/* 모임 정보 */}
        <p
          className="
            mt-3
            truncate
            text-[12px]
            text-[#a3a5aa]

            sm:text-[13px]
          "
        >
          {meetingTitle} · {category}
        </p>
      </div>
    </article>
  );
}