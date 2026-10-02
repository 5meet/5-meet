"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { HERO_SLIDES } from "../constants/filters";

type HeroBannerProps = {
  searchSlot?: ReactNode;
};

/** 시안: 왼쪽 그린 카피 + 오른쪽 사진, 검색바는 배너 하단에 겹침. 배너 콘텐츠는 정적. */
export function HeroBanner({ searchSlot }: HeroBannerProps) {
  const [index, setIndex] = useState(0);
  const slide = HERO_SLIDES[index] ?? HERO_SLIDES[0];
  const last = HERO_SLIDES.length - 1;

  return (
    <section className="relative pb-8">
      <div className="relative h-[220px] overflow-hidden rounded-[28px] md:h-[280px]">
        <div className="absolute inset-0 flex">
          <div className="relative z-10 flex w-full flex-col justify-center bg-[#0C7665] px-12 py-8 md:w-[46%] md:px-14">
            <p className="max-w-[280px] text-2xl font-bold leading-snug text-white md:text-3xl">
              {slide.title}
            </p>
            <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-white/85 md:text-base">
              {slide.subtitle}
            </p>
          </div>
          <div className="relative hidden flex-1 md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/meetings-hero.jpg"
              alt=""
              className="h-full w-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0C7665] to-transparent" />
          </div>
        </div>

        <button
          type="button"
          aria-label="이전 배너"
          onClick={() => setIndex((i) => (i === 0 ? last : i - 1))}
          className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm md:left-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="다음 배너"
          onClick={() => setIndex((i) => (i === last ? 0 : i + 1))}
          className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm md:right-4"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <span className="absolute bottom-12 right-6 z-20 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white md:bottom-14">
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-primary-500" />
          {index + 1}/{HERO_SLIDES.length}
        </span>
      </div>

      {searchSlot ? (
        <div className="absolute inset-x-6 bottom-2 z-30 md:inset-x-10">
          {searchSlot}
        </div>
      ) : null}
    </section>
  );
}
