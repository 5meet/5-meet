import {
  ButtonHTMLAttributes,
  forwardRef,
} from "react";

import { Spinner } from "../Spinner/Spinner";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 테마 @default "primary" */
  variant?: ButtonVariant;

  /** 버튼 크기 (높이/패딩/폰트) @default "md" */
  size?: ButtonSize;

  /** 가로 너비를 부모 영역에 맞게 100%로 채울지 여부 @default false */
  fullWidth?: boolean;

  /** 비동기 작업 진행 중 로딩 스피너 표시 여부 @default false */
  isLoading?: boolean;
}

const variantStyles: Record<
  ButtonVariant,
  string
> = {
  primary:
    "bg-primary-500 text-gray-50 hover:bg-primary-600 active:bg-[#007a4f]",

  secondary:
    "bg-[#FFFFFF] border border-gray-200 text-gray-800 hover:border-primary-500 hover:text-primary-600",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs font-semibold rounded-lg",
  md: "h-11 px-5 text-sm font-semibold rounded-xl",
  lg: "h-[52px] px-7 text-base font-bold rounded-2xl",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      type = "button",
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
      "relative w-full inline-flex items-center justify-center transition-all duration-150 select-none text-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

    const isDisabled =
      disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(
          baseStyle,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size={size} />
            <span className="sr-only">
              로딩 중
            </span>
          </span>
        )}

        <span
          className={
            isLoading ? "invisible" : ""
          }
        >
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;