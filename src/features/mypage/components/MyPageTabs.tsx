"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MYPAGE_TABS = [
  {
    label: "나의 모임",
    href: "/mypage/meetings",
  },
  {
    label: "나의 리뷰",
    href: "/mypage/reviews",
  },
  {
    label: "내가 만든 모임",
    href: "/mypage/created-meetings",
  },
] as const;

export default function MyPageTabs() {
  const currentPath = usePathname();

  return (
    <nav aria-label="마이페이지 메뉴" className="w-full">
      <ul
        className="
          relative flex h-10
          after:absolute after:inset-x-0 after:bottom-0
          after:h-0.5 after:bg-gray-200
          sm:h-[62px]
        "
      >
        {MYPAGE_TABS.map((tab) => {
          const isActive = currentPath === tab.href;

          return (
            <li
              key={tab.href}
              className="h-full flex-1 sm:w-[159px] sm:flex-none"
            >
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative z-10
                  flex h-full items-center justify-center
                  whitespace-nowrap
                  text-sm font-semibold leading-5 tracking-[-0.28px]
                  sm:text-xl sm:leading-[30px] sm:tracking-[-0.4px]
                  ${
                    isActive
                      ? "text-primary-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary-500"
                      : "text-gray-600 hover:text-gray-700"
                  }
                `}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
