"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-full border border-gray-100 bg-white px-5 shadow-[0_8px_24px_rgba(12,118,101,0.12)]">
      <Search className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="모임명, 키워드, 관심사를 검색해보세요"
        className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
        aria-label="모임 검색"
      />
      <button
        type="button"
        className="text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label="검색 필터"
      >
        <SlidersHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}
