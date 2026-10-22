"use client";

import { useId } from "react";
import { Heart } from "lucide-react";
import { IconButton } from "./IconButton";

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  isLoading?: boolean;
}

export const LikeButton = ({
  isLiked,
  onToggle,
  size = "md",
  disabled = false,
  isLoading = false,
}: LikeButtonProps) => {
  const gradientId = useId();

  return (
    <>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FF5A8A" />
            <stop offset="100%" stopColor="#FF2D55" />
          </linearGradient>
        </defs>
      </svg>

      <IconButton
        size={size}
        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
        aria-pressed={isLiked}
        onClick={onToggle}
        disabled={disabled}
        isLoading={isLoading}
      >
        <Heart
          className={
            isLiked
              ? "fill-current text-[#FF477E]"
              : "text-gray-500"
          }
          stroke={isLiked ? `url(#${gradientId})` : "currentColor"}
        />
      </IconButton>
    </>
  );
};