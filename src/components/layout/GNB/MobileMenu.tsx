"use client";

import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "./constants";

import { useLogout } from "@/features/auth/logout/hooks/useLogout";
import type { User } from "@/features/auth/type";

interface MobileMenuProps {
  user: User | null;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useLogout();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  return (
    <>
      {/* 메뉴 열기 버튼 */}
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen(true)}
        className="flex size-9 items-center justify-center text-gray-600 min-[744px]:hidden"
      >
        <Menu className="size-5" />
      </button>

      {/* 배경 오버레이 */}
      <div
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-in-out min-[744px]:hidden ${
          isOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />

      {/* 사이드바 */}
      <nav
        id="mobile-navigation"
        aria-label="모바일 메뉴"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed top-0 right-0 z-50 flex h-dvh w-[272px] max-w-[85vw] flex-col rounded-l-[20px] bg-white px-7 shadow-xl transition-transform duration-300 ease-in-out min-[744px]:hidden motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 닫기 버튼 */}
        <div className="flex h-16 shrink-0 items-center justify-end">
          <button
            type="button"
            aria-label="사이드바 닫기"
            onClick={() => setIsOpen(false)}
            className="flex size-6 items-center justify-center text-gray-400"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* 메뉴 목록 */}
        <ul className="flex flex-col gap-2">
          {NAV_ITEMS.map((item, index) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex h-14 items-center justify-between text-sm transition-colors hover:text-emerald-500 ${
                  index === 0
                    ? "font-semibold text-emerald-500"
                    : "font-medium text-gray-500"
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight
                  className="size-4 text-gray-400"
                  strokeWidth={1.5}
                />
              </Link>
            </li>
          ))}

          {user && (
            <li>
              <Link
                href="/mypage/meetings"
                onClick={() => setIsOpen(false)}
                className="flex h-14 items-center justify-between text-sm font-medium text-gray-500 transition-colors hover:text-emerald-500"
              >
                <span>마이페이지</span>
                <ChevronRight
                  className="size-4 text-gray-400"
                  strokeWidth={1.5}
                />
              </Link>
            </li>
          )}
        </ul>

        {/* 하단 로그인 / 로그아웃 */}
        <div className="mt-auto flex justify-end pb-9">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-gray-400 transition-colors hover:text-gray-700"
            >
              로그아웃
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-400 transition-colors hover:text-gray-700"
            >
              로그인
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
