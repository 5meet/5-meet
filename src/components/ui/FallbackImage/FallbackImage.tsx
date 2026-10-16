"use client";

import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fallbackClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
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
}: FallbackImageProps) {
  const initialSrc = src?.trim() ? src : fallbackSrc;
  const [imageSrc, setImageSrc] = useState(initialSrc);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={
        imageSrc === fallbackSrc ? (fallbackClassName ?? className) : className
      }
      onError={() => {
        if (imageSrc !== fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
      }}
    />
  );
}
