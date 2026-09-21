import Image from "next/image";
import Kebab from "@/components/ui/Kebab/Kebab";

interface UserProfile {
  id: string;
  name: string;
  image: string | null;
}

interface ReviewCardProps {
  user: UserProfile;
  score: number;
  comment: string;
  datetime: string;
  isOwner: boolean;
}

const ReviewCard = ({
  user,
  score,
  comment,
  datetime,
  isOwner,
}: ReviewCardProps) => {
  return (
    <div>
      <div>
        {/* TODO: HeartRating 컴포넌트화 */}
        <div>{score}</div>

        {/* TODO: 리뷰 남긴 유저 프로필(이미지 + 이름) + 리뷰 생성일 컴포넌트 */}
        <div>
          <div>
            <Image
              src={user.image ?? "/profile/profile_female1.svg"}
              alt={`${user.name} 프로필`}
              fill
              className="object-cover"
            />
            <span>{user.name}</span>
          </div>
          <span>{datetime}</span>
        </div>
      </div>

      <div>
        <span className="font-normal text-lg text-[#374151]">{comment}</span>
        {/* {isOwner && (
          <Kebab
            onEdit={() => {
              // TODO: 리뷰 수정
            }}
            onDelete={() => {
              // TODO: 리뷰 삭제
            }}
          />
        )} */}
      </div>
    </div>
  );
};

export default ReviewCard;
