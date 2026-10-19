"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

import Input, { type InputProps } from "@/components/ui/Form/input/Input";

interface PasswordInputProps extends InputProps {}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      isError = false,
      size = "large",
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={isVisible ? "text" : "password"}
          size={size}
          isError={isError}
          disabled={disabled}
          className={`pr-12 ${className}`}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsVisible((prev) => !prev)}
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            cursor-pointer
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
          aria-pressed={isVisible}
        >
          {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;