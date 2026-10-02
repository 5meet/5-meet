import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com", // 실제 이미지 서버 도메인으로 교체
      },
      // 이미지 업로드 API(presigned URL)가 쓰는 실제 스토리지 도메인도 추가 필요
      // 예: S3라면 "your-bucket.s3.ap-northeast-2.amazonaws.com" 등
    ],
  },
};

export default nextConfig;
