import Link from "next/link";
import { MobileMenu } from "./MobileMenu";

const NAV_ITEMS = [
  {
    label: "모임 찾기",
    href: "/meetings",
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

export default function GNB() {
  return (
    <header className="relative w-full bg-[#f5f7f8]">
      <div
        className="
          mx-auto flex h-16 w-full items-center px-4
          min-[744px]:max-w-280 min-[744px]:px-6
          lg:max-w-350
        "
      >
        {/* 로고 */}
        <Link
          href="/meetings"
          className="
            shrink-0 text-xl font-bold text-emerald-500
            min-[744px]:text-2xl
          "
        >
          같이달램
        </Link>

        {/* Tablet / Desktop 메뉴 */}
        <nav
          aria-label="주요 메뉴"
          className="
            ml-10 hidden h-full
            min-[744px]:block
          "
        >
          <ul className="flex h-full items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="h-full">
                <Link
                  href={item.href}
                  className="
                    flex h-full items-center
                    border-b-2 border-transparent px-1
                    text-sm font-semibold text-gray-500
                    transition-colors hover:text-primary-500
                  "
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 오른쪽 */}
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/login"
            className="
              inline-flex h-8 items-center justify-center
              rounded-lg bg-emerald-500 px-4
              text-xs font-semibold text-white
              transition-colors hover:bg-primary-600
              min-[744px]:h-9 min-[744px]:px-5 min-[744px]:text-sm
            "
          >
            로그인
          </Link>

          {/* Mobile */}
          <div className="min-[744px]:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}