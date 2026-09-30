"use client";
import Label from "@/components/ui/Form/label/Label";
import Input from "@/components/ui/Form/input/Input";
import Button from "@/components/ui/Button/Button";
import PasswordInput from "@/components/ui/Form/input/PasswordInput";
import SocialLoginButton from "../../components/SocialLoginButton";

import { useForm } from "react-hook-form";
import FormErrorMessage from "@/components/ui/Form/formErrorMessage/FormErrorMessage";
import { loginAction } from "../actions/loginActions";
import { useDebouncedTrigger } from "@/lib/hooks/useDebouncedTrigger";
import { useModal } from "@/contexts/ModalContext";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  redirect: string;
}

interface LoginFormValue {
  email: string;
  password: string;
}

export default function LoginForm({ redirect }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, touchedFields, isSubmitting, isValidating },
  } = useForm<LoginFormValue>({ mode: "onBlur" });
  const { openAlert } = useModal();
  const router = useRouter();

  const emailValue = watch("email");
  const passwordValue = watch("password");

  const onSubmit = async (data: LoginFormValue) => {
    const result = await loginAction(data);
    if (!result.success) {
      openAlert({
        message: result.message ?? "로그인에 실패했습니다.",
      });
      return;
    }
    // 로그인 성공
    router.replace(redirect);
  };

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
  });
  return (
    <section
      className="w-full max-w-169 rounded-2xl bg-white px-10 py-9"
      aria-labelledby="login-title"
    >
      <h1
        id="login-title"
        className="mb-8 text-center text-lg font-bold text-gray-900"
      >
        로그인
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        {/* 아이디 영역 */}
        <div className="flex flex-col">
          <Label htmlFor="email" required className="mb-2">
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            isError={!!errors.email}
            {...register("email", {
              required: "이메일을 입력해주세요.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "올바른 이메일 형식을 입력해주세요.",
              },
            })}
          />
          <FormErrorMessage message={errors.email?.message} />
        </div>

        {/* 비밀번호 영역 */}
        <div className="flex flex-col">
          <Label htmlFor="password" required className="mb-2">
            비밀번호
          </Label>
          <PasswordInput
            id="password"
            placeholder="비밀번호를 입력해주세요"
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

          <FormErrorMessage message={errors.password?.message} />
        </div>

        <Button
          type="submit"
          fullWidth
          className="mt-4"
          isLoading={isSubmitting}
          disabled={!isValid || isValidating || isSubmitting}
        >
          로그인
        </Button>
      </form>

      <div className="my-8 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-gray-300" />
        <span className="text-sm text-gray-500">SNS 계정으로 로그인</span>
        <div className="h-px flex-1 bg-gray-300" />
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <SocialLoginButton provider="google" className="sm:flex-1" />
        <SocialLoginButton provider="kakao" className="sm:flex-1" />
      </div>
    </section>
  );
}
