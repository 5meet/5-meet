"use client";

import { CATEGORY_CHIPS } from "../constants/filters";

type CategoryChipsProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function CategoryChips({ selectedId, onSelect }: CategoryChipsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      role="tablist"
      aria-label="모임 카테고리"
    >
      {CATEGORY_CHIPS.map((chip) => {
        const selected = chip.id === selectedId;
        return (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(chip.id)}
            className={`h-9 shrink-0 rounded-full px-4 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-primary-500 ${
              selected
                ? "bg-primary-500 text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
