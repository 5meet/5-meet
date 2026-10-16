"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface FallbackImageProps {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fallbackClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  onFallback?: () => void;
}

const DEFAULT_FALLBACK = "/banner.svg";

export default function FallbackImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  fallbackClassName,
  fill = false,
  width,
  height,
  onFallback,
}: FallbackImageProps) {
  const originalSrc = src?.trim() ? src : null;
  const hasOriginal = Boolean(originalSrc && originalSrc !== fallbackSrc);

  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const notifiedRef = useRef(false);

  const isOriginalLoaded = loadedSrc === originalSrc;
  const isOriginalFailed = failedSrc === originalSrc;

  useEffect(() => {
    // 이미지 URL이 없으면 대체 이미지를 사용하고 알림
    if (!originalSrc && !notifiedRef.current) {
      notifiedRef.current = true;
      onFallback?.();
    }
  }, [originalSrc, onFallback]);

  const handleImageError = () => {
    if (notifiedRef.current) return;

    notifiedRef.current = true;
    setFailedSrc(originalSrc);
    onFallback?.();
  };

  const imageSize = fill ? {} : { width, height };

  return (
    <div
      className={fill ? "relative h-full w-full" : "relative"}
      style={fill ? undefined : { width, height }}
    >
      {/* 원본 이미지 로딩 중에만 대체 이미지 표시 */}
      {(!hasOriginal || !isOriginalLoaded || isOriginalFailed) && (
        <Image
          src={fallbackSrc}
          alt={alt}
          fill={fill}
          {...imageSize}
          className={fallbackClassName ?? className}
          sizes="100vw"
        />
      )}

      {/* 원본 로딩 성공 시 원본 이미지만 유지 */}
      {hasOriginal && !isOriginalFailed && (
        <Image
          key={originalSrc}
          src={originalSrc!}
          alt={alt}
          fill={fill}
          {...imageSize}
          className={[
            className,
            "transition-opacity duration-200",
            isOriginalLoaded ? "opacity-100" : "opacity-0",
          ]
            .filter(Boolean)
            .join(" ")}
          sizes="100vw"
          onLoad={() => setLoadedSrc(originalSrc)}
          onError={handleImageError}
        />
      )}
    </div>
  );
}
