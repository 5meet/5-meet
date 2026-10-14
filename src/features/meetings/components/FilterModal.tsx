"use client";

import { Button } from "@/components/ui/Button/Button";

type FilterModalProps = {
  open: boolean;
  onClose: () => void;
  region: string;
  onRegionChange: (region: string) => void;
  dateStart: string;
  dateEnd: string;
  onDateStartChange: (value: string) => void;
  onDateEndChange: (value: string) => void;
};

export function FilterModal({
  open,
  onClose,
  region,
  onRegionChange,
  dateStart,
  dateEnd,
  onDateStartChange,
  onDateEndChange,
}: FilterModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 md:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2 id="filter-modal-title" className="text-lg font-bold text-gray-900">
          필터
        </h2>
        <label className="mt-4 block text-sm font-semibold text-gray-800">
          지역
          <input
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"
            value={region}
            onChange={(event) => onRegionChange(event.target.value)}
            placeholder="예: 서울 강남구"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-gray-800">
          시작일
          <input
            type="date"
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"
            value={dateStart}
            onChange={(event) => onDateStartChange(event.target.value)}
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-gray-800">
          종료일
          <input
            type="date"
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"
            value={dateEnd}
            onChange={(event) => onDateEndChange(event.target.value)}
          />
        </label>
        <p className="mt-2 text-xs text-gray-500">
          날짜는 서버 dateStart / dateEnd(ISO)로 보냅니다. DatePicker는 피그마 확정 후 교체.
        </p>
        <Button fullWidth className="mt-6" onClick={onClose}>
          적용
        </Button>
      </div>
    </div>
  );
}
