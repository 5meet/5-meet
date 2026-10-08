"use client";

import Image from "next/image";
import { useState } from "react";

import { Filter } from "@/components/ui/Filter/Filter";
import { FavoriteList } from "@/features/favorites/components/FavoriteList";

export function FavoritesPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [isUrgent, setIsUrgent] = useState(false);

  const handleDateChange = (
    nextDateStart: string,
    nextDateEnd: string,
  ) => {
    setDateStart(nextDateStart);
    setDateEnd(nextDateEnd);
  };

  return (
    <main className="min-h-screen bg-[#f5f7f8]">
      <div
        className="
          mx-auto
          w-full
          max-w-[1060px]
          px-5
          pb-16
          pt-10
          md:px-8
          md:pt-14
        "
      >
        <header
          className="
            mb-10
            flex
            items-center
            gap-5
          "
        >
          <div className="relative h-[66px] w-[80px] shrink-0">
            <Image
              src="/favorites.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.8px] text-[#151922]">
              찜한 모임
            </h1>

            <p className="mt-2 text-[16px] text-[#a1a4aa]">
              마음에 드는 모임을 저장하고 빠르게 참여해보세요
            </p>
          </div>
        </header>

        <Filter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          dateStart={dateStart}
          dateEnd={dateEnd}
          onDateChange={handleDateChange}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          isUrgent={isUrgent}
          onUrgentChange={() => setIsUrgent((prev) => !prev)}
        />

        <FavoriteList />
      </div>
    </main>
  );
}