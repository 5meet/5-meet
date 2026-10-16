import Link from "next/link";
import { logoutAction } from "@/features/auth/logout/actions/logoutAction";

type AuthMenuProps = {
  user: { name: string } | null | undefined;
  isPending: boolean;
  isError: boolean;
};

export function AuthMenu({ user, isPending, isError }: AuthMenuProps) {
  if (isPending) {
    return <span className="text-sm text-gray-400">확인 중...</span>;
  }

  if (isError) {
    return <span className="text-sm text-red-500">사용자 정보 오류</span>;
  }

  if (user) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <span className="text-sm font-semibold text-gray-700">
          {user.name}님
        </span>
        <form action={logoutAction}>
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