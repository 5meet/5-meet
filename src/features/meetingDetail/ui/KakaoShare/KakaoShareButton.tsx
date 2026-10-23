"use client";

import Image from "next/image";
import { IconButton } from "@/components/ui/IconButton/IconButton";

interface KakaoShareButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const KakaoShareButton = ({ onClick, isLoading }: KakaoShareButtonProps) => (
  <IconButton
    aria-label="카카오톡으로 공유하기"
    onClick={onClick}
    isLoading={isLoading}
    className="bg-[#FEE500] border-[#FEE500] hover:border-[#FEE500] cursor-pointer disabled:cursor-not-allowed"
  >
    <Image src="/social/kakao.svg" alt="" width={20} height={20} />
  </IconButton>
);

export default KakaoShareButton;
