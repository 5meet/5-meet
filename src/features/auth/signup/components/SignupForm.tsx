"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import Input from "@/components/ui/Form/input/Input";
import Label from "@/components/ui/Form/label/Label";
import { Button } from "@/components/ui/Button/Button";
import AlertModal from "@/components/ui/Modal/AlertModal";

import { useSignupMutation } from "../hook/useSignupMutation";
import { SignupRequest } from "../types";

interface SignupFormValues extends SignupRequest {
  passwordConfirm: string;
}

export default function SignupForm() {
  // 회원가입 API 통신 뮤테이션 훅 (요청 함수, 로딩 상태 추출)
  const { mutate: signup, isPending } = useSignupMutation();

  // 폼 관리 설정: 입력값 변경 시 실시간 유효성 검사를 위해 mode를 'onChange'로 설정
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    mode: "onChange",
  });
  // 비밀번호 일치 여부 비교 및 재검증 트리거를 위해 실시간 값 구독
  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");

  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  console.log(showPassword["password"])
  // 비밀번호를 수정했을 때, 이미 입력된 '비밀번호 확인' 필드의 일치 여부를 즉각 재검증
  useEffect(() => {
    if (passwordConfirm) {
      trigger("passwordConfirm");
    }
  }, [password, passwordConfirm, trigger]);

  const toggleVisibility = (field: "password" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // 폼 제출 핸들러: API 스펙에 맞게 passwordConfirm을 제외하고 서버로 전송
  const onSubmit = ({ passwordConfirm, ...payload }: SignupFormValues) => {
    signup(payload, {
      onError: (error) => {
        console.log("회원가입 실패:", error);
        setModalMessage(error.message);
      },
    });
  };

  return (
    <>
      <section
        className="w-full max-w-169 rounded-2xl bg-white px-10 py-9"
        aria-labelledby="signup-title"
      >
        <h1
          id="signup-title"
          className="mb-8 text-center text-lg font-bold text-gray-900"
        >
          회원가입
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" required>
              이름
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="이름을 입력해주세요"
              autoComplete="name"
              isError={!!errors.name}
              {...register("name", {
                required: "이름을 입력해주세요.",
                setValueAs: (v: string) => v?.trim(),
              })}
            />
            {errors.name && (
              <p className="text-sm text-error-100">{errors.name.message}</p>
            )}
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" required>
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              autoComplete="email"
              isError={!!errors.email}
              {...register("email", {
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "올바른 이메일 형식을 입력해주세요.",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-error-100">{errors.email.message}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" required>
              비밀번호
            </Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword.password ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요"
                autoComplete="new-password"
                className="pr-12"
                isError={!!errors.password}
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                  validate: (value) => {
                    if (/\s/.test(value)) {
                      return "비밀번호에는 공백을 사용할 수 없습니다.";
                    }
                    if (value.length < 8) {
                      return "비밀번호는 8자 이상 입력해주세요.";
                    }
                    return true;
                  },
                })}
              />

              <button
                type="button"
                onClick={() => toggleVisibility("password")}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                aria-label={
                  showPassword.password ? "비밀번호 숨기기" : "비밀번호 보기"
                }
              >
                {showPassword.password ? (
                  <Eye size={20} />
                ) : (
                  <EyeOff size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-error-100">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="passwordConfirm" required>
              비밀번호 확인
            </Label>

            <div className="relative">
              <Input
                id="passwordConfirm"
                type={showPassword.confirm ? "text" : "password"}
                placeholder="비밀번호를 한 번 더 입력해주세요"
                autoComplete="new-password"
                className="pr-12"
                isError={!!errors.passwordConfirm}
                {...register("passwordConfirm", {
                  required: "비밀번호 확인을 입력해주세요.",
                  validate: (value) =>
                    value === password || "비밀번호가 일치하지 않습니다.",
                })}
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                aria-label={
                  showPassword.confirm
                    ? "비밀번호 확인 숨기기"
                    : "비밀번호 확인 보기"
                }
              >
                {showPassword.confirm ? (
                  <Eye size={20} />
                ) : (
                  <EyeOff size={20} />
                )}
              </button>
            </div>
            {errors.passwordConfirm && (
              <p className="text-sm text-error-100">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            className="mt-6"
            isLoading={isPending}
            disabled={!isValid || isPending}
          >
            회원가입
          </Button>
        </form>

        <div className="my-8 flex items-center gap-3" aria-hidden="true">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-sm text-gray-500">SNS 계정으로 회원가입</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>
      </section>

      {/* 에러달발생시 모달 */}
      <AlertModal
        isOpen={!!modalMessage}
        message={modalMessage}
        onClose={() => setModalMessage("")}
      />
    </>
  );
}
