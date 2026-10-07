"use client";

import { useState } from "react";
import Image from "next/image";

import { mockReviews } from "@/data/reviews";

import { Filter } from "@/components/ui/Filter/Filter";
import { ReviewSummary } from "./ReviewSummary";
import { ReviewList } from "./ReviewList";

export function ReviewsPage() {
  const [selectedCategory, setSelectedCategory] =
    useState("전체");

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [selectedRegion, setSelectedRegion] =
    useState("all");

  const [isUrgent, setIsUrgent] = useState(false);

  const handleDateChange = (
    nextDateStart: string,
    nextDateEnd: string,
  ) => {
    setDateStart(nextDateStart);
    setDateEnd(nextDateEnd);
  };

  const handleUrgentChange = () => {
    setIsUrgent((prev) => !prev);
  };

  return (
    <main className="min-h-screen bg-[#f5f7f8]">
      <section className="mx-auto w-full max-w-[1060px] px-5 py-12 sm:px-5 sm:py-10 md:px-6 md:py-12">
        <div className="mb-10 flex items-center gap-5 sm:mb-9 sm:gap-5 md:mb-10">
          <div
            className="
              relative
              h-[58px] w-[68px]
              shrink-0
              sm:h-[62px] sm:w-[74px]
              md:h-[66px] md:w-[80px]
            "
          >
            <Image
              src="/reviews.svg"
              alt="모든 리뷰"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="mb-2 text-[27px] font-bold tracking-[-1.5px] sm:text-[26px] md:mb-2 md:text-[27px]">
              모든 리뷰
            </h1>

            <p className="text-sm text-[#a0a4aa] sm:text-[13px] md:text-sm">
              같이 활동한 모임원들의 이야기를 확인해보세요
            </p>
          </div>
        </div>

        <Filter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          dateStart={dateStart}
          dateEnd={dateEnd}
          onDateChange={handleDateChange}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          isUrgent={isUrgent}
          onUrgentChange={handleUrgentChange}
        />

        <ReviewSummary reviews={mockReviews} />

        <ReviewList reviews={mockReviews} />
      </section>
    </main>
  );
}