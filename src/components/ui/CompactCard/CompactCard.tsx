"use client";

import { useState } from "react";
import Image from "next/image";
import Tags from "@/components/ui/Tags/Tags";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";
import { showToast } from "@/components/ui/Sonner";
import Link from "next/link";

interface CompactCardProps {
  id: number;
  title: string;
  location: string;
  category: string;
  dateTime: string;
  registrationEnd: string;
  image: string;
  initialIsFavorited: boolean;
}

const CompactCard = ({
  id,
  title,
  location,
  category,
  dateTime,
  registrationEnd,
  image,
  initialIsFavorited,
}: CompactCardProps) => {
  //IF : TanStack Query 사용 -> useState 삭제 후 Query와 mutation으로 관리
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  // 찜하기
  const handleLikeToggle = async () => {
    try {
      // TODO: const result = await toggleLike(meetingId);

      setIsFavorited((prev) => !prev);

      // TODO: API 연결 후 result.isFavorited으로 변경
      showToast({
        kind: "success",
        message: isFavorited
          ? "찜 목록에서 삭제되었습니다."
          : "찜 목록에 추가되었습니다.",
      });
    } catch (error) {
      console.error("찜 상태 변경에 실패했습니다.", error);

      showToast({
        kind: "error",
        message: "찜 상태 변경에 실패했습니다.",
      });
    }
  };

  return (
    <Link
      href={`/meetings/${id}`}
      className="flex flex-col gap-2.5 min-w-0 w-[162px] h-[270px] md:gap-3.5 md:w-[302px] md:h-[286px]"
    >
      <div className="relative overflow-hidden w-full h-[162px] bg-[#E3E3E3] rounded-2xl md:h-[180px]">
        {image && (
          <Image
            src={image}
            alt={`${title} 모임 이미지`}
            fill
            className="object-cover"
          />
        )}

        <div className="absolute bottom-3 right-3">
          <LikeButton
            isLiked={isFavorited}
            onToggle={handleLikeToggle}
            size="lg"
          />
        </div>
      </div>

      <div className="flex flex-col w-full gap-4 px-1">
        <Tags
          dateTime={dateTime}
          registrationEnd={registrationEnd}
          order="deadline-first"
        />

        <div className="flex flex-col w-full gap-0.5 md:gap-1">
          <span className="min-w-0 text-wrap font-semibold text-base text-black md:text-xl">
            {title}
          </span>

          <div className="flex gap-0.5 text-xs font-medium text-gray-600 md:text-sm">
            <Image src="/ic_location.svg" alt="" width={16} height={16} />
            <span>{location}</span>
            <span>·</span>
            <span>{category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompactCard;
