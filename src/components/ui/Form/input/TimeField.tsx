"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface TimeFieldProps {
  value: string; // "17:30"
  onChange: (time: string) => void;
  isError?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, m) =>
  String(m).padStart(2, "0"),
);
// 5분 단위
// const MINUTES = Array.from({ length: 12 }, (_, i) =>
//   String(i * 5).padStart(2, "0"),
// );

export const TimeField = ({
  value,
  onChange,
  isError = false,
}: TimeFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hour, minute] = value ? value.split(":") : ["", ""];

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

  const handleSelectHour = (h: string) => onChange(`${h}:${minute || "00"}`);
  const handleSelectMinute = (m: string) => onChange(`${hour || "00"}:${m}`);

  return (
    <div ref={containerRef} className="relative flex-1 w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full gap-2 items-center rounded-xl border px-4 py-2.5 bg-[#F9FAFB] text-left text-sm
          ${isOpen ? "border-primary-500 text-gray-800" : "border-gray-300"}
          ${value ? "text-gray-800" : "text-gray-400"}
          ${isError ? "border-error-100" : ""}`}
      >
        <Image src="ic_clock.svg" alt="시계" width={24} height={24} />
        {value || "00 : 00"}
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 flex w-40 divide-x divide-gray-200 rounded-xl border border-gray-300 bg-white shadow-md">
          <ul className="max-h-52 w-1/2 overflow-y-auto py-1 text-center text-sm">
            {HOURS.map((h) => (
              <li key={h}>
                <button
                  type="button"
                  onClick={() => handleSelectHour(h)}
                  className={`block w-full py-1.5 hover:bg-gray-50 ${
                    h === hour
                      ? "bg-primary-100 font-semibold text-primary-600"
                      : "text-gray-800"
                  }`}
                >
                  {h}
                </button>
              </li>
            ))}
          </ul>

          <ul className="max-h-52 w-1/2 overflow-y-auto py-1 text-center text-sm">
            {MINUTES.map((m) => (
              <li key={m}>
                <button
                  type="button"
                  onClick={() => handleSelectMinute(m)}
                  className={`block w-full py-1.5 hover:bg-gray-50 ${
                    m === minute
                      ? "bg-primary-100 font-semibold text-primary-600"
                      : "text-gray-800"
                  }`}
                >
                  {m}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
