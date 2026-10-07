"use client";

import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import { getMonthMatrix } from "./getMonthMatrix";
import { convertDateType3 } from "@/lib/convertDate/formatMeetingDate";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export interface DateRange {
  start: string;
  end: string;
}

type CalendarProps =
  | {
      mode: "single";
      value: string;
      onApply: (value: string) => void;
      onClose: () => void;
    }
  | {
      mode: "range";
      value: DateRange;
      onApply: (value: DateRange) => void;
      onClose: () => void;
    };

const toDate = (dateStr: string) => (dateStr ? new Date(dateStr) : new Date());

const Calendar = (props: CalendarProps) => {
  const { mode, value, onApply, onClose } = props;

  // isOpen일 때만 마운트되므로, useState 초기값만으로 열릴 때마다 draft가 최신 value로 리셋
  const [draft, setDraft] = useState(value);

  const baseDate = mode === "single" ? toDate(value) : toDate(value.start);
  const [viewYear, setViewYear] = useState(baseDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(baseDate.getMonth());

  const weeks = getMonthMatrix(viewYear, viewMonth);

  const moveMonth = (diff: number) => {
    const d = new Date(viewYear, viewMonth + diff, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const handleSelectDay = (day: number) => {
    const selected = convertDateType3(new Date(viewYear, viewMonth, day));

    if (mode === "single") {
      setDraft(selected);
      return;
    }

    const current = draft as DateRange;

    if (!current.start || (current.start && current.end)) {
      setDraft({ start: selected, end: "" });
      return;
    }

    // start는 있고 end는 없는 상태 → 이번 클릭으로 end 확정
    if (selected < current.start) {
      // 시작일보다 이전 날짜를 고르면 순서를 바꿔줌
      setDraft({ start: selected, end: current.start });
    } else {
      setDraft({ start: current.start, end: selected });
    }
  };

  const handleReset = () => {
    setDraft(mode === "single" ? "" : { start: "", end: "" });
  };

  const handleApply = () => {
    onApply(draft as never);
    onClose();
  };

  const isSingleSelected = (dateStr: string) =>
    mode === "single" && draft === dateStr;

  const isRangeEndpoint = (dateStr: string) => {
    if (mode !== "range") return false;
    const { start, end } = draft as DateRange;
    return dateStr === start || dateStr === end;
  };

  const isInRange = (dateStr: string) => {
    if (mode !== "range") return false;
    const { start, end } = draft as DateRange;
    if (!start || !end) return false;
    return dateStr > start && dateStr < end;
  };

  return (
    <div className="absolute z-20 mt-1 w-72 rounded-xl border border-gray-300 bg-white p-4 shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          aria-label="이전 달"
        >
          ‹
        </button>
        <span className="text-sm font-semibold">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button type="button" onClick={() => moveMonth(1)} aria-label="다음 달">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-400">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 text-center text-sm">
          {week.map((day, di) => {
            if (day === null) return <span key={di} className="h-8 w-8" />;

            const dateStr = convertDateType3(
              new Date(viewYear, viewMonth, day),
            );
            const selected =
              isSingleSelected(dateStr) || isRangeEndpoint(dateStr);
            const inRange = isInRange(dateStr);

            return (
              <button
                type="button"
                key={di}
                onClick={() => handleSelectDay(day)}
                className={`h-8 w-8 rounded-lg ${
                  selected
                    ? "bg-primary-200 text-primary-600 font-semibold"
                    : inRange
                      ? "bg-primary-100 text-primary-600"
                      : "hover:bg-gray-100"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      ))}

      <div className="flex w-full gap-3 justify-between mt-3">
        <Button variant="secondary" size="md" onClick={handleReset}>
          초기화
        </Button>
        <Button variant="primary" size="md" onClick={handleApply}>
          적용
        </Button>
      </div>
    </div>
  );
};

export default Calendar;
