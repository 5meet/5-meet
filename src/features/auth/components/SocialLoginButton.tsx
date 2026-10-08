import Image from "next/image";

import Button from "@/components/ui/Button/Button";

import type { SocialProvider } from "../type";
import { cn } from "@/lib/utils";
import { useGoogleSocialLogin } from "../login/hooks/useGoogleSocialLogin";



interface SocialLoginButtonProps {
  provider: SocialProvider;
  redirect:string;
  className?: string;
}

const socialStyles: Record<SocialProvider, string> = {
  kakao:
    "border-0 bg-[#FEE500] text-[#191919] hover:border-0 hover:bg-[#FEE500] hover:text-[#191919] cursor-pointer",
  google:
    "border border-gray-200 bg-white text-gray-800 hover:border-gray-200 hover:bg-white hover:text-gray-800 cursor-pointer",
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
  redirect,
  className,
}: SocialLoginButtonProps) {
  const{login: googleLogin, isLoading} = useGoogleSocialLogin(redirect)

  return (
    <Button
      type="button"
      variant="secondary"
      fullWidth
      isLoading={isLoading}
      onClick={() => {
        if (provider === "google") {
          googleLogin();
        }
      }}
      className={cn(socialStyles[provider], className)}
    >
      <span className="flex items-center justify-center gap-2">
        <Image src={socialIcons[provider]} alt="" width={20} height={20} />
        <span>{socialLabels[provider]}</span>
      </span>
    </Button>
  );
}
