"use client";

import { useEffect } from "react";
import Script from "next/script";

interface KakaoMapScriptProps {
  onReady?: () => void;
  onError?: () => void;
}

const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
const SDK_SRC = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;

export const KakaoMapScript = ({ onReady, onError }: KakaoMapScriptProps) => {
  // 이미 SDK가 로드되어 있는 경우(페이지 재진입 등) 바로 준비 완료 처리
  useEffect(() => {
    if (window.kakao?.maps?.load) {
      window.kakao.maps.load(() => onReady?.());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!kakaoKey) return null;

  return (
    <Script
      id="kakao-map-sdk"
      src={SDK_SRC}
      strategy="afterInteractive"
      onLoad={() => {
        window.kakao.maps.load(() => onReady?.());
      }}
      onError={(e) => {
        console.error("Kakao SDK 로드 실패:", e);
        onError?.();
      }}
    />
  );
};
