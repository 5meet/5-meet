/**프로젝트 전반에서 사용하는 공통 버튼 컴포넌트입니다. */

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from '../Spinner/Spinner';

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 테마 @default "primary" */
  variant?: ButtonVariant;
  /** 버튼 크기 (높이/패딩/폰트) @default "md" */
  size?: ButtonSize;
  /** 가로 너비를 부모 영역에 맞게 100%로 채울지 여부 @default false */
  fullWidth?: boolean;
  /** 비동기 작업 진행 중 로딩 스피너 표시 여부 @default false */
  isLoading?: boolean;
}

//Record<Keys, value>는 객체의 key의 타입과 value의 타입을 지정하는 문법입니다.
//Record<string, number>를 예시로 들면 객체의 key에는 string타입만 value에는 number 타입만 가능합니다.

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-gray-50 hover:bg-primary-600 active:bg-[#007a4f]",
  secondary:
    "bg-[#FFFFFF] border border-gray-200 text-gray-800 hover:border-primary-500 hover:text-primary-600",
};

// width는 내부에서 고정하지 않고 외부 props(className 등)로 전달받아 처리
const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs font-semibold rounded-lg",
  md: "h-11 px-5 text-sm font-semibold rounded-xl",
  lg: "h-[52px] px-7 text-base font-bold rounded-2xl",
};


/**
 * 프로젝트 전반에서 사용하는 공통 버튼 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Button onClick="{handleClick}" size="lg" variant="primary">
 *   참여하기
 * </Button>
 *
 * <Button fullWidth variant="secondary">
 *   취소
 * </Button>
 * ```
 */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type="button",
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled = false,
      isLoading = false,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyle =
      "relative inline-flex items-center justify-center transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";
    const isDisabled = disabled || isLoading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          ${baseStyle}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `.trim()}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size={size} />
          </span>
        )}

        <span className={isLoading ? "invisible" : ""}>
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";
