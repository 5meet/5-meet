import Image from "next/image";

import Button from "@/components/ui/Button/Button";
import { cn } from "@/lib/utils";

type SocialProvider = "kakao" | "google";

interface SocialLoginButtonProps {
  provider: SocialProvider;
  className?: string;
}

const socialStyles: Record<SocialProvider, string> = {
  kakao: "border-0 bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]",
  google: "border border-gray-200 bg-white text-gray-800 hover:bg-gray-50",
};

const socialLabels: Record<SocialProvider, string> = {
  kakao: "카카오로 계속하기",
  google: "Google로 계속하기",
};

const socialIcons: Record<SocialProvider, string> = {
  kakao: "/icons/social/kakao.svg",
  google: "/icons/social/google.svg",
};

export default function SocialLoginButton({
  provider,
  className,
}: SocialLoginButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      fullWidth
      className={cn(socialStyles[provider], className)}
    >
      <span className="flex items-center justify-center gap-2">
        <Image src={socialIcons[provider]} alt="" width={20} height={20} />

        <span>{socialLabels[provider]}</span>
      </span>
    </Button>
  );
}
