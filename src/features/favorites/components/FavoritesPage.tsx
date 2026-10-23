"use client";

import Image from "next/image";
import { useState } from "react";

import { Filter } from "@/components/ui/Filter/Filter";
import { FavoriteList } from "@/features/favorites/components/FavoriteList";
import { useDeleteFavoriteMutation } from "@/features/favorites/hook/useDeleteFavoriteMutation";
import { useFavoritesQuery } from "@/features/favorites/hook/useFavoritesQuery";
import type {
  FavoriteMeeting,
  GetFavoritesParams,
} from "@/features/favorites/types";

function getStartOfDay(date: string): number | undefined {
  if (!date) return undefined;

  const timestamp = new Date(`${date}T00:00:00`).getTime();

  return Number.isNaN(timestamp) ? undefined : timestamp;
}

function getEndOfDay(date: string): number | undefined {
  if (!date) return undefined;

  const timestamp = new Date(`${date}T23:59:59.999`).getTime();

  return Number.isNaN(timestamp) ? undefined : timestamp;
}

function toStartOfDay(date: string): string | undefined {
  if (!date) return undefined;

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toISOString();
}

function toEndOfDay(date: string): string | undefined {
  if (!date) return undefined;

  const parsedDate = new Date(`${date}T23:59:59.999`);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toISOString();
}

function filterFavoriteMeetings(
  meetings: FavoriteMeeting[],
  selectedCategory: string,
  selectedRegion: string,
  dateStart: string,
  dateEnd: string,
  isUrgent: boolean,
): FavoriteMeeting[] {
  const startTimestamp = getStartOfDay(dateStart);
  const endTimestamp = getEndOfDay(dateEnd);

  const filtered = meetings.filter((favorite) => {
    const meeting = favorite.meeting;

    if (
      selectedCategory !== "전체" &&
      meeting.type !== selectedCategory
    ) {
      return false;
    }

    if (
      selectedRegion !== "all" &&
      !meeting.region.includes(selectedRegion)
    ) {
      return false;
    }

    const meetingTimestamp = new Date(meeting.dateTime).getTime();

    if (Number.isNaN(meetingTimestamp)) {
      return false;
    }

    if (
      startTimestamp !== undefined &&
      meetingTimestamp < startTimestamp
    ) {
      return false;
    }

    if (
      endTimestamp !== undefined &&
      meetingTimestamp > endTimestamp
    ) {
      return false;
    }

    return true;
  });

  if (isUrgent) {
    filtered.sort(
      (a, b) =>
        new Date(a.meeting.registrationEnd).getTime() -
        new Date(b.meeting.registrationEnd).getTime(),
    );
  }

  return filtered;
}

export function FavoritesPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [isUrgent, setIsUrgent] = useState(false);

  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const queryParams: GetFavoritesParams = {
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
      sortBy: "registrationEnd",
      sortOrder: "asc",
    }),
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useFavoritesQuery(queryParams);

  const sourceMeetings: FavoriteMeeting[] = data?.data ?? [];

  const displayedMeetings = filterFavoriteMeetings(
    sourceMeetings,
    selectedCategory,
    selectedRegion,
    dateStart,
    dateEnd,
    isUrgent,
  );

  const handleDateChange = (
    nextDateStart: string,
    nextDateEnd: string,
  ) => {
    setDateStart(nextDateStart);
    setDateEnd(nextDateEnd);
  };

  const handleFavoriteClick = (meetingId: number) => {
    if (deleteFavoriteMutation.isPending) return;

    deleteFavoriteMutation.mutate(meetingId);
  };

  return (
    <main className="min-h-screen bg-[#f5f7f8]">
      <div className="mx-auto w-full max-w-[1060px] px-5 pb-16 pt-10 md:px-8 md:pt-14">
        <header className="mb-10 flex items-center gap-5">
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

        {isError && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-50 p-4">
            <p role="alert" className="text-sm text-red-600">
              {error instanceof Error
                ? `API 조회 실패: ${error.message}`
                : "찜한 모임을 불러오지 못했습니다."}
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700"
            >
              다시 시도
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[315px] items-center justify-center">
            <p
              role="status"
              className="text-[14px] font-medium text-[#a7aaad]"
            >
              찜한 모임을 불러오는 중이에요.
            </p>
          </div>
        ) : (
          <FavoriteList
            meetings={displayedMeetings}
            onFavoriteClick={handleFavoriteClick}
          />
        )}

        {deleteFavoriteMutation.isError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {deleteFavoriteMutation.error instanceof Error
              ? deleteFavoriteMutation.error.message
              : "찜 해제에 실패했습니다."}
          </p>
        )}
      </div>
    </main>
  );
}
