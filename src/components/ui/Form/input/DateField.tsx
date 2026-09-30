"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Calendar from "../../Calendar/Calendar";

interface DateFieldProps {
  value: string;
  onChange: (date: string) => void;
}

export const DateField = ({ value, onChange }: DateFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1 w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full gap-2 items-center rounded-xl border px-4 py-2.5 bg-[#F9FAFB] text-left text-sm
          ${isOpen ? "border-primary-500 text-gray-800" : "border-gray-300 "}
          ${value ? "text-gray-800" : "text-gray-400"}`}
      >
        <Image src="ic_calendar.svg" alt="달력" width={24} height={24} />
        {value || "YYYY-MM-DD"}
      </button>

      {isOpen && (
        <Calendar
          mode="single"
          value={value}
          onApply={onChange}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
