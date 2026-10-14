
/** 프로젝트 전반에서 사용하는 공통 Input 컴포넌트입니다. */
/** Label 컴포넌트와 함께 사용할 수 있습니다. */

import React, { forwardRef } from "react";

type InputSize = "small" | "large";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  isError?: boolean;
  size?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  small: "h-10 rounded-[10px] px-4 text-sm leading-5",
  large: "h-12 rounded-xl px-5 text-base leading-6",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      isError = false,
      size = "large",
      className = "",
      disabled,
      type,
      min,
      onChange,
      ...props
    },
    ref,
  ) => {
    const isNumberType = type === "number";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isNumberType && min !== undefined && Number(min) >= 0) {
        const { value } = e.target;

        if (value !== "" && Number(value) < Number(min)) {
          e.target.value = String(min);
        }
      }

      onChange?.(e);
    };

    return (
      <input
        ref={ref}
        type={type}
        min={min}
        disabled={disabled}
        onChange={handleChange}
        className={`
          w-full
          bg-[#F9FAFB]
          text-gray-800
          placeholder:text-gray-500
          border border-transparent
          outline-none
          transition-colors duration-200
          focus:border-primary-500
          ${sizeStyles[size]}
          ${isError ? "border-error-100 focus:border-error-100" : ""}
          disabled:bg-gray-50
          disabled:text-gray-400
          disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
