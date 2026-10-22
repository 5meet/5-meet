"use client";

import Link from "next/link";

import { useLogout } from "@/features/auth/logout/hooks/useLogout";

type AuthMenuProps = {
  user: { name: string } | null | undefined;
  isPending: boolean;
  isError: boolean;
};

export function AuthMenu({ user, isPending, isError }: AuthMenuProps) {
  const { logout } = useLogout();

  if (isPending) {
    return <span className="text-sm text-gray-400">확인 중...</span>;
  }

  if (isError) {
    return <span className="text-sm text-red-500">사용자 정보 오류</span>;
  }

  if (user) {
    return (
      <div className="hidden items-center gap-3 min-[744px]:flex">
        <Link
          href="/mypage/meetings"
          className="text-sm font-semibold text-gray-700"
        >
          {user.name}님
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            로그아웃
          </button>
        </form>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex h-8 items-center justify-center rounded-lg bg-emerald-500 px-4 text-xs font-semibold text-white transition-colors hover:bg-primary-600 md:h-9 md:px-5 md:text-sm"
    >
      로그인
    </Link>
  );
}