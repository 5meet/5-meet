"use client";

import { Calendar, MapPin, SlidersHorizontal } from "lucide-react";

type SortFilterBarProps = {
  sortId: string;
  onSortChange: (id: string) => void;
  onOpenFilter: () => void;
};

const FIGMA_SORTS = [
  { id: "date", label: "날짜순", icon: Calendar },
  { id: "nearby", label: "가까운순", icon: MapPin, disabled: true },
] as const;

export function SortFilterBar({
  sortId,
  onSortChange,
  onOpenFilter,
}: SortFilterBarProps) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {FIGMA_SORTS.map((option) => {
        const Icon = option.icon;
        const disabled = "disabled" in option && option.disabled;
        const selected = option.id === sortId;
        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            title={disabled ? "가까운순 API·GPS는 아직 없습니다" : undefined}
            onClick={() => onSortChange(option.id)}
            className={`inline-flex items-center gap-1 px-2 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-40 ${
              selected ? "text-gray-800" : "text-gray-500"
            }`}
          >
            <Icon className="h-4 w-4" />
            {option.label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onOpenFilter}
        className="ml-1 inline-flex h-9 items-center gap-1 rounded-lg bg-primary-500 px-3 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        필터
      </button>
    </div>
  );
}
