"use client";

import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

const categories = [
  "전체",
  "취미/여가",
  "자기계발",
  "비즈니스",
  "라이프스타일",
  "가족/육아",
] as const;

const regionOptions = [
  { label: "지역 전체", value: "all" },
  { label: "서울", value: "서울" },
  { label: "경기", value: "경기" },
  { label: "인천", value: "인천" },
  { label: "부산", value: "부산" },
  { label: "대구", value: "대구" },
  { label: "광주", value: "광주" },
  { label: "대전", value: "대전" },
  { label: "울산", value: "울산" },
  { label: "세종", value: "세종" },
  { label: "강원", value: "강원" },
  { label: "충북", value: "충북" },
  { label: "충남", value: "충남" },
  { label: "전북", value: "전북" },
  { label: "전남", value: "전남" },
  { label: "경북", value: "경북" },
  { label: "경남", value: "경남" },
  { label: "제주", value: "제주" },
] as const;

interface FilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;

  dateStart: string;
  dateEnd: string;
  onDateChange: (
    dateStart: string,
    dateEnd: string,
  ) => void;

  selectedRegion: string;
  onRegionChange: (region: string) => void;

  isUrgent: boolean;
  onUrgentChange: () => void;
}

export function Filter({
  selectedCategory,
  onCategoryChange,
  dateStart,
  dateEnd,
  onDateChange,
  selectedRegion,
  onRegionChange,
  isUrgent,
  onUrgentChange,
}: FilterProps) {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const getDateLabel = () => {
    if (!dateStart && !dateEnd) {
      return "날짜 전체";
    }

    if (dateStart && dateEnd) {
      return `${dateStart} ~ ${dateEnd}`;
    }

    if (dateStart) {
      return `${dateStart} 이후`;
    }

    return `${dateEnd} 이전`;
  };

  const selectedRegionLabel =
    regionOptions.find(
      (option) => option.value === selectedRegion,
    )?.label ?? "지역 전체";

  const handleStartDateChange = (
    value: string,
  ) => {
    onDateChange(value, dateEnd);
  };

  const handleEndDateChange = (
    value: string,
  ) => {
    onDateChange(dateStart, value);
  };

  const handleResetDate = () => {
    onDateChange("", "");
    setIsDateOpen(false);
  };

  return (
    <div
      className="
        mb-7
        flex flex-col gap-4

        md:flex-row
        md:items-center
        md:justify-between
        md:gap-6
      "
    >
      <div
        className="
          flex
          min-w-0
          items-center
          gap-2
          overflow-x-auto
          scrollbar-none
        "
      >
        {categories.map((category) => {
          const isSelected =
            selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`
                shrink-0
                rounded-full
                px-4 py-2
                text-xs
                whitespace-nowrap
                transition-colors

                ${
                  isSelected
                    ? "bg-[#4b4d50] font-semibold text-white"
                    : "bg-[#eceff1] text-[#555a61] hover:bg-[#e1e4e6]"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div
        className="
          flex
          shrink-0
          items-center
          gap-5
          text-xs
          text-[#777b82]

          md:gap-4
        "
      >
        {/* 날짜 */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsDateOpen((prev) => !prev)
            }
            className="flex max-w-[220px] shrink-0 items-center gap-1"
          >
            <span className="truncate">
              {getDateLabel()}
            </span>

            <ChevronDown
              size={13}
              className="shrink-0"
            />
          </button>

          {isDateOpen && (
            <div
              className="
                absolute
                right-0
                top-7
                z-30
                w-[260px]
                rounded-xl
                border
                border-[#e5e7eb]
                bg-white
                p-4
                shadow-lg
              "
            >
              <div className="mb-3">
                <p className="text-xs font-semibold text-[#4b4d50]">
                  모임 날짜
                </p>

                <p className="mt-1 text-[11px] text-[#a1a4aa]">
                  시작일과 종료일을 선택해주세요.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#777b82]">
                    시작일
                  </span>

                  <input
                    type="date"
                    value={dateStart}
                    max={dateEnd || undefined}
                    onChange={(event) =>
                      handleStartDateChange(
                        event.target.value,
                      )
                    }
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-[#e5e7eb]
                      bg-white
                      px-3
                      text-xs
                      text-[#4b4d50]
                      outline-none
                      focus:border-[#4b4d50]
                    "
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#777b82]">
                    종료일
                  </span>

                  <input
                    type="date"
                    value={dateEnd}
                    min={dateStart || undefined}
                    onChange={(event) =>
                      handleEndDateChange(
                        event.target.value,
                      )
                    }
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-[#e5e7eb]
                      bg-white
                      px-3
                      text-xs
                      text-[#4b4d50]
                      outline-none
                      focus:border-[#4b4d50]
                    "
                  />
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetDate}
                  className="
                    text-[11px]
                    text-[#999da3]
                    hover:text-[#4b4d50]
                  "
                >
                  날짜 초기화
                </button>

                <button
                  type="button"
                  onClick={() => setIsDateOpen(false)}
                  className="
                    rounded-md
                    bg-[#4b4d50]
                    px-3
                    py-1.5
                    text-[11px]
                    font-semibold
                    text-white
                  "
                >
                  적용
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 지역 */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsRegionOpen((prev) => !prev)
            }
            className="flex shrink-0 items-center gap-1"
          >
            {selectedRegionLabel}

            <ChevronDown size={13} />
          </button>

          {isRegionOpen && (
            <div
              className="
                absolute
                right-0
                top-7
                z-30
                max-h-[280px]
                min-w-[120px]
                overflow-y-auto
                rounded-lg
                border
                border-[#e5e7eb]
                bg-white
                py-1
                shadow-lg
              "
            >
              {regionOptions.map((option) => {
                const isSelected =
                  selectedRegion === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onRegionChange(option.value);
                      setIsRegionOpen(false);
                    }}
                    className={`
                      block
                      w-full
                      px-4
                      py-2
                      text-left
                      text-xs
                      transition-colors

                      ${
                        isSelected
                          ? "bg-[#f1f2f3] font-semibold text-[#4b4d50]"
                          : "text-[#777b82] hover:bg-[#f7f7f7]"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 마감 임박 */}
        <button
          type="button"
          onClick={onUrgentChange}
          className={`
            flex
            shrink-0
            items-center
            gap-1
            transition-colors

            ${
              isUrgent
                ? "font-semibold text-primary-500"
                : "text-[#777b82]"
            }
          `}
        >
          <SlidersHorizontal size={13} />
          마감 임박
        </button>
      </div>
    </div>
  );
}