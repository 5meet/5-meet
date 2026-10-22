"use client";

import Script from "next/script";

const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

export const KakaoShareScript = () => {
  if (!kakaoJsKey) {
    console.error("카카오 JavaScript 키가 설정되지 않았습니다.");
    return null;
  }

  return (
    <Script
      id="kakao-share-sdk"
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(kakaoJsKey);
        }
      }}
      onError={() => {
        console.error("카카오 공유 SDK 로드에 실패했습니다.");
      }}
    />
  );
};
