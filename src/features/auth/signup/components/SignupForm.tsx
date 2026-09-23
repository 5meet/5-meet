"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Input from "@/components/ui/Form/input/Input";
import Label from "@/components/ui/Form/label/Label";
import Button from "@/components/ui/Button/Button";

import { useModal } from "@/contexts/ModalContext";
import { useSignupMutation } from "../hook/useSignupMutation";
import { checkEmail } from "../api/emailCheck";
import { SignupRequest } from "../types";
import PasswordInput from "@/components/ui/Form/input/PasswordInput";
import FormErrorMessage from "@/components/ui/Form/formErrorMessage/FormErrorMessage";
import { useDebouncedTrigger } from "@/lib/hooks/useDebouncedTrigger";

interface SignupFormValues extends SignupRequest {
  passwordConfirm: string;
}

export default function SignupForm() {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignupMutation();
  const { openAlert } = useModal();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, isSubmitting, isValidating, touchedFields },
  } = useForm<SignupFormValues>({
    mode: "onBlur",
  });
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const nameValue = watch("name");
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const passwordConfirmValue = watch("passwordConfirm");

  useDebouncedTrigger({
    trigger,
    touchedFields,
    value: nameValue,
    field: "name",
  });

  useDebouncedTrigger({
    trigger,
    touchedFields,
    value: emailValue,
    field: "email",
  });

  useDebouncedTrigger({
    trigger,
    touchedFields,
    value: passwordValue,
    field: "password",
    additionalFieldName: "passwordConfirm",
    shouldTriggerAdditional: !!passwordConfirmValue,
  });

  useDebouncedTrigger({
    trigger,
    touchedFields,
    value: passwordConfirmValue,
    field: "passwordConfirm",
  });

  const onSubmit = ({ passwordConfirm, ...payload }: SignupFormValues) => {
    signup(
      { ...payload, name: payload.name.trim() },
      {
        onSuccess: () => {
          openAlert({
            message: "가입이 완료되었습니다.",
            onClose: () => router.replace("/login"),
          });
        },

        onError: (error) => {
          openAlert({
            message: error.message,
          });
        },
      },
    );
  };

  return (
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        {/* 이름 */}
        <div className="flex flex-col">
          <Label htmlFor="name" required className="mb-2">
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
              validate: (value) => {
                const trimmedValue = value.trim();
                if (!trimmedValue) return "이름을 입력해주세요.";
                if (trimmedValue.length > 20)
                  return "이름은 20자 이하로 입력해주세요.";
                return true;
              },
            })}
          />
          <FormErrorMessage message={errors.name?.message} />
        </div>

        {/* 이메일 */}
        <div className="flex flex-col">
          <Label htmlFor="email" required className="mb-2">
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
              onChange: () => setIsEmailAvailable(false),
              validate: async (value) => {
                try {
                  const email = value.trim();
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return true;

                  const { available } = await checkEmail({ email });
                  if (!available) {
                    setIsEmailAvailable(false);
                    return "이미 사용 중인 이메일입니다.";
                  }
                  setIsEmailAvailable(true);
                  return true;
                } catch {
                  setIsEmailAvailable(false);
                  return "이메일 중복 확인 중 오류가 발생했습니다.";
                }
              },
            })}
          />
          <div className="mt-1.5 min-h-5 text-sm">
            {errors.email ? (
              <p className="text-error-100">{errors.email.message}</p>
            ) : isEmailAvailable ? (
              <p className="text-green-600">사용 가능한 이메일입니다.</p>
            ) : null}
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col">
          <Label htmlFor="password" required className="mb-2">
            비밀번호
          </Label>
          <PasswordInput
            id="password"
            placeholder="비밀번호를 입력해주세요"
            autoComplete="new-password"
            isError={!!errors.password}
            {...register("password", {
              required: "비밀번호를 입력해주세요.",
              validate: (value) => {
                if (/\s/.test(value))
                  return "비밀번호에는 공백을 사용할 수 없습니다.";
                if (value.length < 8)
                  return "비밀번호는 8자 이상 입력해주세요.";
                return true;
              },
            })}
          />
        </div>
        <FormErrorMessage message={errors.password?.message} />

        {/* 비밀번호 확인 */}
        <div className="flex flex-col">
          <Label htmlFor="passwordConfirm" required className="mb-2">
            비밀번호 확인
          </Label>
          <PasswordInput
            id="passwordConfirm"
            placeholder="비밀번호를 한 번 더 입력해주세요"
            autoComplete="new-password"
            isError={!!errors.passwordConfirm}
            {...register("passwordConfirm", {
              required: "비밀번호 확인을 입력해주세요.",
              validate: (value) =>
                value === watch("password") || "비밀번호가 일치하지 않습니다.",
            })}
          />
        </div>
        <FormErrorMessage message={errors.passwordConfirm?.message} />

        <Button
          type="submit"
          fullWidth
          className="mt-4"
          isLoading={isPending || isValidating || isSubmitting}
          disabled={!isValid || isPending || isValidating || isSubmitting}
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
  );
}
