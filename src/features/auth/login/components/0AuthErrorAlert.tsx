
"use client";

import { useEffect, useRef } from "react";

import { useModal } from "@/contexts/ModalContext";

interface OAuthErrorAlertProps {
  error?: string;
}

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  kakao_cancel: "카카오 로그인이 취소되었습니다.",
  kakao_state: "로그인 인증 정보를 확인할 수 없습니다. 다시 시도해주세요.",
  kakao_code: "카카오 인증 정보를 받지 못했습니다. 다시 시도해주세요.",
  kakao_login: "카카오 로그인에 실패했습니다. 다시 시도해주세요.",
};

export default function OAuthErrorAlert({
  error,
}: OAuthErrorAlertProps) {
  const { openAlert } = useModal();
  const handledErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!error || handledErrorRef.current === error) return;

    handledErrorRef.current = error;

    const message =
      OAUTH_ERROR_MESSAGES[error] ??
      "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";

    openAlert({ message });

    // error만 제거하고 redirect는 유지
    const url = new URL(window.location.href);
    url.searchParams.delete("error");

    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [error, openAlert]);

  return null;
}
