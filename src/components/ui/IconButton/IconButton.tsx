import React from "react";
import { Spinner } from "../Spinner/Spinner"; // 기존 Spinner 활용

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  "aria-label": string;
  isLoading?: boolean; //isLoading은 낙천적 업데이트나 IconButton으로 서버에 요청하는 일이 없으면 지우기
}

const sizeStyles = {
  sm: "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4",
  md: "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-12 w-12 [&_svg]:h-6 [&_svg]:w-6",
};

export const IconButton = ({
  size = "md",
  children,
  className = "",
  disabled = false,
  isLoading = false,
  ...props
}: IconButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`
        relative inline-flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm transition-all duration-200
        hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5
        active:translate-y-0 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none disabled:shadow-none
        ${sizeStyles[size]} 
        ${className}
      `.trim()}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner size={size} />
        </span>
      )}

      {/* 로딩 중일 때는 아이콘을 숨겨 레이아웃 틀어짐 방지 */}
      <span
        className={isLoading ? "invisible" : "flex items-center justify-center"}
      >
        {children}
      </span>
    </button>
  );
};
