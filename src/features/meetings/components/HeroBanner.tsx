"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { HERO_SLIDES } from "../constants/filters";

export function HeroBanner() {
  const [index, setIndex] = useState(0);

  const slide = HERO_SLIDES[index];

  const handlePrev = () => {
    setIndex((prev) =>
      prev === 0 ? HERO_SLIDES.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setIndex((prev) =>
      prev === HERO_SLIDES.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section className="relative flex h-50 w-full overflow-hidden bg-primary-700 md:h-70 md:rounded-3xl">
      {/* 이미지 영역 */}
      <div className="absolute inset-0 md:relative md:inset-auto md:order-2 md:w-[58%]">
        <Image
          src="/meetings-hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />

        {/* 모바일 이미지 오버레이 */}
        <div className="absolute inset-0 bg-black/35 md:hidden" />

        {/* 데스크톱 그라데이션 */}
        <div className="absolute inset-y-0 left-0 hidden w-16 bg-linear-to-r from-primary-700 to-transparent md:block" />
      </div>

      {/* 텍스트 영역 */}
      <div className="relative z-10 flex w-full flex-col justify-center gap-2 px-12 text-white md:w-[42%] md:gap-3 md:px-14">
        <h2 className="whitespace-pre-line text-xl font-bold md:text-3xl">
          {slide.title}
        </h2>

        <p className="whitespace-pre-line text-sm md:text-base">
          {slide.subtitle}
        </p>
      </div>

      {/* 이전 버튼 */}
      <button
        type="button"
        aria-label="이전 슬라이드"
        onClick={handlePrev}
        className="absolute top-1/2 left-2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-1.5 text-white md:left-3 md:p-2"
      >
        <ChevronLeft className="size-5" />
      </button>

      {/* 다음 버튼 */}
      <button
        type="button"
        aria-label="다음 슬라이드"
        onClick={handleNext}
        className="absolute top-1/2 right-2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-1.5 text-white md:right-3 md:p-2"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* 슬라이드 페이지 표시 */}
      <div className="absolute right-4 bottom-7 z-20 rounded-full bg-black/40 px-2.5 py-1 text-xs text-white md:right-4 md:bottom-9 md:px-3">
        {index + 1} / {HERO_SLIDES.length}
      </div>
    </section>
  );
}