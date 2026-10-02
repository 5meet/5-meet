"use client";

import Image from "next/image";
import { useState } from "react";

import { Filter } from "@/components/ui/Filter/Filter";
import { mockFavoriteGroups } from "@/data/favorites";
import { FavoriteList } from "@/features/favorites/components/FavoriteList";

export function FavoritesPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredGroups =
    selectedCategory === "전체"
      ? mockFavoriteGroups
      : mockFavoriteGroups.filter(
          (group) => group.category === selectedCategory,
        );

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
              마감되기 전에 지금 바로 참여해보세요 👀
            </p>
          </div>
        </header>

        <Filter />

        <FavoriteList />
      </div>
    </main>
  );
}