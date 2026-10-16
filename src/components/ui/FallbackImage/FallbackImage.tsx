"use client";

import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

const DEFAULT_FALLBACK = "/meetings-hero.jpg";

export default function FallbackImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
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
      className={className}
      onError={() => {
        if (imageSrc !== fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
      }}
    />
  );
}
