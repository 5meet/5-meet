// 비밀번호 입력 공통 컴포넌트입니다.
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Input from "@/components/ui/Form/input/Input";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
}

export default function PasswordInput({
  isError,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={isVisible ? "text" : "password"}
        isError={isError}
        className="pr-12"
      />

      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
        aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );
}