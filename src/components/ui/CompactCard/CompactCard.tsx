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
  //IF : TanStack Query 사용 -> useState 삭제 후 Query와 mutation으로 관리
  const [isFavorited, setIsFavorited] = useState(
    props.variant === "meeting" ? props.initialIsFavorited : false,
  );

  // 찜하기
  const handleLikeToggle = async () => {
    if (props.variant !== "meeting") return;

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

  const href =
    props.variant === "meeting" ? `/meetings/${props.id}` : `/talk/${props.id}`;

  return (
    <Link
      href={href}
      className="flex flex-col gap-2.5 min-w-0 w-[162px] h-[270px] md:gap-3.5 md:w-[302px] md:h-[286px]"
    >
      <div className="relative z-0 overflow-hidden w-full h-[162px] bg-[#E3E3E3] rounded-2xl md:rounded-3xl md:h-[180px]">
        {props.image && (
          <Image
            src={props.image}
            alt={`${props.title} 이미지`}
            fill
            className="object-cover"
          />
        )}

        {props.variant === "meeting" && (
          <div
            className="absolute bottom-3.5 right-3.5 z-10 md:bottom-5 md:right-5"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <LikeButton
              isLiked={isFavorited}
              onToggle={handleLikeToggle}
              size="lg"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col w-full gap-1.5 px-1 md:gap-4">
        {props.variant === "meeting" && (
          <Tags
            dateTime={props.dateTime}
            registrationEnd={props.registrationEnd}
            order="deadline-first"
          />
        )}

        <div className="flex flex-col w-full gap-0.5 md:gap-1">
          <span className="min-w-0 text-wrap font-semibold text-base text-black md:text-xl">
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
    </Link>
  );
};

export default CompactCard;
