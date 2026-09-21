import Image from "next/image";
import { ReviewCardProps } from "@/features/meetingDetail/types/meetingDetail";

const ReviewCard = ({
  id,
  user: user,
  score,
  comment,
  datetime,
  isLast = false,
}: ReviewCardProps) => {
  return (
    <div
      className={`flex w-full flex-col gap-6 pt-4 pb-6 ${
        isLast ? "" : "border-b border-b-gray-400"
      }`}
    >
      <div className="flex flex-col gap-1.5">
        {/* TODO: HeartRating 컴포넌트 */}
        <div>{score}</div>

        {/* TODO: 리뷰 남긴 유저 프로필(이미지 + 이름) + 리뷰 생성일 */}
        <div className="flex gap-1.5 font-normal text-sm text-gray-500">
          <div className="flex gap-1.5">
            <Image
              src={user.image ?? "/profile/profile_female1.svg"}
              alt={`${user.name} 프로필`}
              width={24}
              height={24}
              className="object-cover"
            />

            <span>{user.name}</span>
          </div>

          <span>{datetime}</span>
        </div>
      </div>

      <div>
        <span className="font-normal text-lg text-[#374151]">{comment}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
