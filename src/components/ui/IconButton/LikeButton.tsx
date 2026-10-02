import { useId } from "react";
import { Heart } from "lucide-react";
import { IconButton } from "./IconButton";

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
}

export const LikeButton = ({
  isLiked,
  onToggle,
  size = "md",
}: LikeButtonProps) => {
  const gradientId = useId();
  return (
    <>
      {/* #mint-gradient-500: 왼쪽(#17DA71)에서 오른쪽(#08DDF0)으로 이어지는 선형 그라데이션 정의 */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#17DA71" />
            <stop offset="100%" stopColor="#08DDF0" />
          </linearGradient>
        </defs>
      </svg>

      <IconButton
        size={size}
        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
        aria-pressed={isLiked}
        onClick={onToggle}
      >
        <Heart
          fill={isLiked ? `url(#${gradientId})` : "none"}
          stroke={isLiked ? `url(#${gradientId})` : "currentColor"}
          className={`w-5 h-5 transition-transform duration-200 ${
            isLiked ? "scale-110" : "scale-100"
          }`}
        />
      </IconButton>
    </>
  );
};
