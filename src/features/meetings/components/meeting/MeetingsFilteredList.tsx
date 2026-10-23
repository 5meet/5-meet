"use client";

import { useState } from "react";

import { Filter } from "@/components/ui/Filter/Filter";
import { InfiniteMeetingList } from "./InfiniteMeetingList";
import type { MeetingFilters } from "@/lib/types/meeting";

interface MeetingsFilteredListProps {
  keyword?: string;
}

function toStartOfDay(date: string) {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toISOString();
}

function toEndOfDay(date: string) {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(`${date}T23:59:59.999`);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toISOString();
}

export function MeetingsFilteredList({
  keyword,
}: MeetingsFilteredListProps) {
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

const filters: MeetingFilters = {
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

  return (
    <>
      <div className="px-4 md:px-6">
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
      </div>

      <InfiniteMeetingList
        // 검색 조건마다 인스턴스를 분리해 이전 요청의 잠금이 유지되지 않도록 합니다.
        key={JSON.stringify([keyword ?? "", filters])}
        keyword={keyword}
        filters={filters}
      />
    </>
  );
}
