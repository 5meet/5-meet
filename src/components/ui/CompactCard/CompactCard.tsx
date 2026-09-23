"use client";

import { useState } from "react";
import Image from "next/image";
import Tags from "@/components/ui/Tags/Tags";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";
import { showToast } from "@/components/ui/Sonner";
import Link from "next/link";

interface BaseCompactCardProps {
  id: number;
  title: string;
  image: string;
}

interface MeetingCompactCardProps extends BaseCompactCardProps {
  variant: "meeting";
  location: string;
  category: string;
  dateTime: string;
  registrationEnd: string;
  initialIsFavorited: boolean;
}

interface TalkCompactCardProps extends BaseCompactCardProps {
  variant: "talk";
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

type CompactCardProps = MeetingCompactCardProps | TalkCompactCardProps;

const CompactCard = (props: CompactCardProps) => {
  const [isFavorited, setIsFavorited] = useState(
    props.variant === "meeting" ? props.initialIsFavorited : false,
  );

  const titleId = `card-title-${props.id}`;

  const handleLikeToggle = async () => {
    if (props.variant !== "meeting") return;
    try {
      setIsFavorited((prev) => !prev);
      showToast({
        kind: "success",
        message: isFavorited
          ? "찜 목록에서 삭제되었습니다."
          : "찜 목록에 추가되었습니다.",
      });
    } catch (error) {
      console.error("찜 상태 변경에 실패했습니다.", error);
      showToast({ kind: "error", message: "찜 상태 변경에 실패했습니다." });
    }
  };

  const href =
    props.variant === "meeting" ? `/meetings/${props.id}` : `/talk/${props.id}`;

  return (
    <div className="relative flex flex-col gap-2.5 min-w-0 w-[162px] h-[270px] md:gap-3.5 md:w-[302px] md:h-[286px]">
      {/* 카드 전체를 덮는 투명 링크: DOM상 다른 요소들과 형제 관계, button과 중첩되지 않음 */}
      <Link
        href={href}
        aria-labelledby={titleId}
        className="absolute inset-0 z-0 rounded-2xl md:rounded-3xl
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        <span className="sr-only">{props.title} 상세보기</span>
      </Link>

      <div className="relative z-1 pointer-events-none overflow-hidden w-full h-[162px] bg-[#E3E3E3] rounded-2xl md:rounded-3xl md:h-[180px]">
        {props.image && (
          <Image src={props.image} alt="" fill className="object-cover" />
        )}

        {props.variant === "meeting" && (
          // 링크(z-0)보다 위, 버튼만 pointer-events 활성화
          <div className="absolute bottom-3.5 right-3.5 z-10 pointer-events-auto md:bottom-5 md:right-5">
            <LikeButton
              isLiked={isFavorited}
              onToggle={handleLikeToggle}
              size="lg"
            />
          </div>
        )}
      </div>

      <div className="relative z-1 pointer-events-none flex flex-col w-full gap-1.5 px-1 md:gap-4">
        {props.variant === "meeting" && (
          <Tags
            dateTime={props.dateTime}
            registrationEnd={props.registrationEnd}
            order="deadline-first"
          />
        )}

        <div className="flex flex-col w-full gap-0.5 md:gap-1">
          <span
            id={titleId}
            className="min-w-0 text-wrap font-semibold text-base text-black md:text-xl"
          >
            {props.title}
          </span>

          {props.variant === "meeting" ? (
            <div className="flex gap-0.5 text-xs font-medium text-gray-600 md:text-sm">
              <Image src="/ic_location.svg" alt="" width={16} height={16} />
              <span>{props.location}</span>
              <span>·</span>
              <span>{props.category}</span>
            </div>
          ) : (
            <div className="flex gap-3 text-xs font-medium text-gray-600 md:text-sm">
              <span>{props.createdAt}</span>
              <div className="flex gap-0.5">
                <Image src="/ic_thumbs_up.svg" alt="" width={18} height={18} />
                <span>{props.likeCount}</span>
              </div>
              <div className="flex gap-0.5">
                <Image src="/ic_message.svg" alt="" width={18} height={18} />
                <span className="text-gray-600">{props.commentCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompactCard;
