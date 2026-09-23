import Image from "next/image";
import { ReviewCardProps } from "@/features/meetingDetail/types/meetingDetail";
import { HeartRating } from "@/components/ui/HeartRating/HeartRating";

const ReviewCard = ({
  id,
  user,
  score,
  comment,
  createdAt,
  isLast = false,
}: ReviewCardProps) => {
  return (
    <div
      className={`flex w-full flex-col gap-3 pt-4 pb-6 mb-2 md:gap-6 ${
        isLast ? "" : "border-b border-b-gray-200"
      }`}
    >
      <div className="flex flex-col gap-1.5">
        <HeartRating rating={score} size="md" />

        <div className="flex gap-1.5 font-normal text-xs text-gray-500 md:text-sm">
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

          <span>{createdAt}</span>
        </div>
      </div>

      <div>
        <span className="font-normal text-sm text-[#374151] md:text-lg">
          {comment}
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;
