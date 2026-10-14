"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import type { User } from "@/features/auth/type";

const NAV_ITEMS = [
  { label: "모임 찾기", href: "/meetings/list" },
  { label: "찜한 모임", href: "/favorites" },
  { label: "모든 리뷰", href: "/reviews" },
  { label: "달램 토크", href: "/talk" },
] as const;

interface MobileMenuProps {
  user: User | null;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex size-9 items-center justify-center text-gray-600 md:hidden"
      >
        {isOpen ? (
          <X className="size-5" />
        ) : (
          <Menu className="size-5" />
        )}
      </button>

      {isOpen && (
        <nav
          aria-label="모바일 메뉴"
          className="absolute top-16 right-0 left-0 z-50 bg-[#f5f7f8] md:hidden"
        >

          <ul className="flex flex-col items-center py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="w-full">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-emerald-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {user && (
              <li className="mt-2 w-full border-t border-gray-200 pt-2">
                <button
                  type="button"
                  className="w-full py-4 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  로그아웃
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </>
  );
}