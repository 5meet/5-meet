import Link from "next/link";
import { MobileMenu } from "./MobileMenu";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { logoutAction } from "@/features/auth/logout/actions/logoutAction";

const NAV_ITEMS = [
  {
    label: "모임 찾기",
    href: "/meetings/list",
  },
  {
    label: "찜한 모임",
    href: "/favorites",
  },
  {
    label: "모든 리뷰",
    href: "/reviews",
  },
  {
    label: "달램 토크",
    href: "/talk",
  },
] as const;

export default async function GNB() {
  const user = await getCurrentUser();
  return (
    <header className="relative w-full bg-[#f5f7f8]">
      <div className="mx-auto flex h-16 w-full items-center px-4 md:max-w-280 md:px-6 md:w-[90%] lg:max-w-350">
        {/* 로고 */}
        <Link
          href="/meetings"
          className="shrink-0 text-xl font-bold text-emerald-500 md:text-2xl"
        >
          같이달램
        </Link>

        {/* 데스크탑 / 태블릿 메뉴 */}
        <nav aria-label="주요 메뉴" className="ml-10 hidden h-full md:block">
          <ul className="flex h-full items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="h-full">
                <Link
                  href={item.href}
                  className="flex h-full items-center border-b-2 border-transparent px-1 text-sm font-semibold text-gray-500 transition-colors hover:text-primary-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 오른쪽 */}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
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
          ) : (
            <Link
              href="/login"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-emerald-500 px-4 text-xs font-semibold text-white transition-colors hover:bg-primary-600 md:h-9 md:px-5 md:text-sm"
            >
              로그인
            </Link>
          )}

          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
}
