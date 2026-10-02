

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

export interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼에 표시할 아이콘 (LucideIcon 컴포넌트) */
  /** 
   * 모임 만들기 아이콘: UserPlus, 
   * 글쓰기 아이콘: PenSquare 
   * 리뷰 아이콘: MessageSquarePlus
   * */
  icon: LucideIcon;
  /** 데스크톱/태블릿 환경에서 노출할 텍스트 */
  label: string;
}

/**
 * 리뷰 쓰기, 게시글 쓰기, 모임 만들기 등 화면에 떠있는 플로팅 액션 버튼(FAB) 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <FloatingActionButton icon="{UserPlus}" label="모임 만들기" onClick="{handleOpenModal}"/>
 * ```
 */

export const FloatingActionButton = forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(({ icon: Icon, label, className = "", disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      // 1. 모바일: w-14 h-14의 정원형
      // 2. md(768px 이상): w-auto px-6 gap-2의 알약형
      className={`
        inline-flex items-center justify-center 
        w-14 h-14 rounded-3xl
        md:w-auto md:h-14 md:px-6 md:gap-2
        bg-primary-500 text-white font-bold 
        shadow-lg hover:bg-primary-600 active:scale-95 
        transition-all duration-200 select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        disabled:pointer-events-none
        ${className}
      `.trim()}
      aria-label={label} // 모바일에서 텍스트가 가려져도 스크린 리더가 버튼 목적을 인지하도록 설정
      {...props}
    >
      <Icon className="w-6 h-6 shrink-0" strokeWidth={2.5} />
      {/* 모바일에서는 숨김(hidden), 태블릿/데스크톱(md)부터 인라인 노출 */}
      <span className="hidden md:inline text-base whitespace-nowrap">
        {label}
      </span>
    </button>
  );
});

FloatingActionButton.displayName = "FloatingActionButton";
