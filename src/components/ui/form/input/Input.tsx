/**프로젝트 전반에서 사용하는 공통 input 컴포넌트입니다. */
/**label 컴포넌트랑 같이 사용하면 됩니다. */

import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
}

//현재 w-full을 사용해서 가로 길이 전체를 사용하는데 나중에 길이 조절이 필요하면 props 방식으로 수정
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isError, className = "", disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        disabled={disabled}
        className={`
          w-full h-12 
          px-5 py-3.5
          bg-white text-gray-800 text-base
          placeholder:text-gray-500
          rounded-2xl
          border border-gray-300 transition-colors duration-200 outline-none
          ${
            isError
              ? "border-red-500 focus:border-error-100"
              : "border-gray-200 focus:border-primary-500"
          }
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
export default Input;
