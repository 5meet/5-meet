"use client";

import Image from "next/image";
import { useState } from "react";

import { Filter } from "@/components/ui/Filter/Filter";
import { FavoriteList } from "@/features/favorites/components/FavoriteList";
import { useDeleteFavoriteMutation } from "@/features/favorites/hook/useDeleteFavoriteMutation";
import { useFavoritesQuery } from "@/features/favorites/hook/useFavoritesQuery";

function toStartOfDay(date: string) {
  if (!date) {
    return undefined;
  }

  return new Date(`${date}T00:00:00`).toISOString();
}

function toEndOfDay(date: string) {
  if (!date) {
    return undefined;
  }

  return new Date(`${date}T23:59:59.999`).toISOString();
}

export function FavoritesPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [selectedRegion, setSelectedRegion] = useState("all");

  const [isUrgent, setIsUrgent] = useState(false);

  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const queryParams = {
    ...(selectedCategory !== "전체" && {
      type: selectedCategory,
    }),

    ...(selectedRegion !== "all" && {
      region: selectedRegion,
    }),

    ...(dateStart && {
      dateStart: toStartOfDay(dateStart),
    }),

    ...(dateEnd && {
      dateEnd: toEndOfDay(dateEnd),
    }),

    ...(isUrgent && {
      sortBy: "registrationEnd" as const,
      sortOrder: "asc" as const,
    }),
  };

  const {
    data,
    isLoading,
    isError,
  } = useFavoritesQuery(queryParams);

  const handleDateChange = (
    nextDateStart: string,
    nextDateEnd: string,
  ) => {
    setDateStart(nextDateStart);
    setDateEnd(nextDateEnd);
  };

  const handleFavoriteClick = (meetingId: number) => {
    if (deleteFavoriteMutation.isPending) {
      return;
    }

    deleteFavoriteMutation.mutate(meetingId);
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
          onUrgentChange={() =>
            setIsUrgent((prev) => !prev)
          }
        />

        {isLoading && (
          <div className="flex min-h-[315px] items-center justify-center">
            <p className="text-[14px] font-medium text-[#a7aaad]">
              찜한 모임을 불러오는 중이에요.
            </p>
          </div>
        )}

        {isError && (
          <div className="flex min-h-[315px] items-center justify-center">
            <p className="text-[14px] font-medium text-[#a7aaad]">
              찜한 모임을 불러오지 못했어요.
            </p>
          </div>
        )}

        {!isLoading && !isError && data && (
          <FavoriteList
            meetings={data.data}
            onFavoriteClick={handleFavoriteClick}
          />
        )}
      </div>
    </main>
  );
}