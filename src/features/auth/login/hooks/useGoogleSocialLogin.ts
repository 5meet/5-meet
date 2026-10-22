// features/auth/login/hooks/useGoogleSocialLogin.ts

"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";


import { useModal } from "@/contexts/ModalContext";
import { CURRENT_USER_QUERY_KEY } from "@/features/auth/hooks/useCurrentUser";
import { socialLoginAction } from "../actions/socialLoginAction";
import { useQueryClient } from "@tanstack/react-query";





export function useGoogleSocialLogin(redirect: string) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openAlert } = useModal();

  const login = useGoogleLogin({
    flow: "implicit",

    onSuccess: async ({ access_token }) => {
      setIsLoading(true);

      try {
        const result = await socialLoginAction("google", access_token);

        if (!result.success) {
          openAlert({
            message: result.message ?? "구글 로그인에 실패했습니다.",
          });
          return;
        }
        await queryClient.resetQueries({
          queryKey: CURRENT_USER_QUERY_KEY,
          exact: true,
        });

        await queryClient.resetQueries({
          queryKey: CURRENT_USER_QUERY_KEY,
          exact: true,
        });

        router.replace(redirect);
        router.refresh();
      } catch {
        openAlert({
          message: "로그인 중 오류가 발생했습니다.",
        });
      } finally {
        setIsLoading(false);
      }
    },

    onError: () => {
      openAlert({
        message: "구글 인증에 실패했습니다.",
      });
    },
  });

  return { login, isLoading };
}
