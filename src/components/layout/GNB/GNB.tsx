"use client";

import Link from "next/link";
import Image from "next/image";

import { MobileMenu } from "./MobileMenu";
import { DesktopMenu } from "./DesktopMenu";
import { AuthMenu } from "./AuthMenu";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

type GNBProps = {
  hasSession: boolean;
};

export default function GNB({ hasSession }: GNBProps) {
  const {
    data: user,
    isLoading,
    isError,
  } = useCurrentUser({ enabled: hasSession });

  return (
    <header className="relative w-full bg-[#f5f7f8]">
      <div className="mx-auto flex h-16 w-full items-center px-4 md:w-[90%] md:max-w-280 md:px-6 lg:max-w-350">
        {/* 로고 */}
        <Link
          href="/meetings"
          className="shrink-0 text-xl font-bold text-emerald-500 md:text-2xl"
        >
          <Image src={"/logo.svg"} alt="같이달램" width={112} height={39} />
        </Link>

        {/* 데스크탑 / 태블릿 메뉴 */}
        <DesktopMenu />

        <div className="ml-auto flex items-center gap-3">
          {/* 사용자 정보 */}
          <AuthMenu
            user={hasSession ? user : null}
            isPending={hasSession && isLoading}
            isError={hasSession && isError}
          />

          {/* 모바일 메뉴 */}
          <MobileMenu user={hasSession ? (user ?? null) : null}  />
        </div>
      </div>
    </header>
  );
}
