
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "./constants";

import { useLogout } from "@/features/auth/logout/hooks/useLogout";
import type { User } from "@/features/auth/type";

interface MobileMenuProps {
  user: User | null;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { logout } = useLogout();

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // 메뉴의 조상 경로를 제외한 배경 요소를 비활성화합니다.
    const backgroundElements = new Map<HTMLElement, boolean>();
    let current: HTMLElement = menu;
    while (current.parentElement) {
      for (const sibling of current.parentElement.children) {
        if (
          sibling instanceof HTMLElement &&
          sibling !== current &&
          sibling !== overlayRef.current
        ) {
          backgroundElements.set(sibling, sibling.inert);
          sibling.inert = true;
        }
      }
      current = current.parentElement;
      if (current === document.body) break;
    }

    const getFocusable = () =>
      Array.from(menu.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
    const focusFirst = () => (getFocusable()[0] ?? menu).focus();
    focusFirst();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
      } else if (event.key === "Tab") {
        const elements = getFocusable();
        const first = elements[0];
        const last = elements.at(-1);
        if (!first || !last) {
          event.preventDefault();
          menu.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const handleFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !menu.contains(event.target)) focusFirst();
    };
    const media = window.matchMedia("(min-width: 744px)");
    const handleDesktop = () => {
      if (media.matches) setIsOpen(false);
    };
    handleDesktop();
    media.addEventListener("change", handleDesktop);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      media.removeEventListener("change", handleDesktop);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      backgroundElements.forEach((inert, element) => { element.inert = inert; });
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const isActivePath = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const isMyPageActive =
    pathname === "/mypage" || pathname.startsWith("/mypage/");

  return (
    <>
      {/* 메뉴 열기 버튼 */}
      <button
        ref={triggerRef}
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
        ref={overlayRef}
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
        ref={menuRef}
        tabIndex={-1}
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
          {NAV_ITEMS.map((item) => {
            const isActive = isActivePath(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-14 items-center justify-between text-sm transition-colors hover:text-emerald-500 ${
                    isActive
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
            );
          })}

          {/* 마이페이지 */}
          {user && (
            <li>
              <Link
                href="/mypage/meetings"
                onClick={() => setIsOpen(false)}
                aria-current={isMyPageActive ? "page" : undefined}
                className={`flex h-14 items-center justify-between text-sm transition-colors hover:text-emerald-500 ${
                  isMyPageActive
                    ? "font-semibold text-emerald-500"
                    : "font-medium text-gray-500"
                }`}
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
