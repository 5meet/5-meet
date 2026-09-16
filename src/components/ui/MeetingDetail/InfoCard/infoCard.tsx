import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";
import Tags from "@/components/ui/Tags/Tags";
import Meetballs from "@/components/ui/Meetballs/Meetballs";

interface MeetingDetailInfoCardProps {
  title: string;
  location: string;
  category: string;
  dateTime: string;
  registrationEnd: string;
  isOwner: boolean;
}

const MeetingDetailInfoCard = ({
  title,
  location,
  category,
  dateTime,
  registrationEnd,
  isOwner,
}: MeetingDetailInfoCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <section className="flex w-85.75 min-h-50 px-6 py-6 bg-white rounded-3xl shadow-sm lg:w-157.5 lg:min-h-70.5 lg:px-10 lg:py-8">
      <div className="flex flex-col w-full gap-5 lg:gap-8">
        <section className="flex flex-col w-full gap-4 lg:gap-5">
          <div className="flex justify-between">
            <Tags dateTime={dateTime} registrationEnd={registrationEnd} />

            {isOwner && (
              <Meetballs
                onEdit={() => {
                  // TODO: 모임 수정
                }}
                onDelete={() => {
                  // TODO: 모임 삭제
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-lg font-semibold text-[#1F2937] lg:text-[28px]">
              <span className="min-w-0 break-words">{title}</span>

              {isOwner && (
                <Image
                  src="/ic_crown.svg"
                  alt="주최자"
                  width={32}
                  height={32}
                />
              )}
            </div>

            <div className="flex gap-0.5 text-sm font-medium text-gray-600 lg:text-base">
              <Image src="/ic_location.svg" alt="" width={16} height={16} />
              <span>{location}</span>
              <span>·</span>
              <span>{category}</span>
            </div>
          </div>
        </section>

        <section className="flex w-full shrink-0 gap-4">
          {/* TODO: isLiked, onToggle - 추후 API 연결 후 수정 */}
          <LikeButton
            isLiked={isLiked}
            onToggle={() => setIsLiked((prev) => !prev)}
            size="lg"
          />

          {/* TODO: isLoading - 추후 API 연결 및 공유 기능 구현 후 수정 */}
          <Button size="lg" variant="primary" fullWidth>
            공유하기
          </Button>
        </section>
      </div>
    </section>
  );
};

export default MeetingDetailInfoCard;
