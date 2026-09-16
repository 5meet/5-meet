import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";
import Tags from "@/components/ui/Tags/Tags";

interface MeetingDetailInforCardProps {
  title: string;
  location: string;
  category: string;
  dateTime: string;
  registrationEnd: string;
  isOwner: boolean;
}

const MeetingDetailInforCard = ({
  title,
  location,
  category,
  dateTime,
  registrationEnd,
  isOwner,
}: MeetingDetailInforCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <section className="flex w-157.5 h-70.5 px-10 py-8 bg-white">
      <div className="flex w-full gap-2.5">
        <div className="w-full">
          <div className="flex justify-between">
            <Tags dateTime={dateTime} registrationEnd={registrationEnd} />

            {/* TODO: meetballs 컴포넌트 - 페이지 접속자가 주최자일 경우 모임 수정, 삭제 가능한 드롭다운 */}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-lg font-semibold text-[#1F2937] lg:text-[28px]">
              <span>{title}</span>

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
              <Image
                src="/ic_location.svg"
                alt="지도 아이콘"
                width={16}
                height={16}
              />
              <span>{location}</span>
              <span>·</span>
              <span>{category}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <LikeButton
            isLiked={isLiked}
            onToggle={() => setIsLiked((prev) => !prev)}
            size="lg"
          />

          <Button size="lg" variant="primary" fullWidth isLoading>
            공유하기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MeetingDetailInforCard;
