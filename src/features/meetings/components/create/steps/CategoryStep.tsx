"use client";

// 모임 만들기 1단계 카테고리(type) 정하기
import Image from "next/image";

import { MEETING_CATEGORIES } from "@/features/meetings/constants/MEETING_CATEGORIES";
import { useFormContext } from "react-hook-form";

export function CategoryStep() {
  const { setValue, watch } = useFormContext();
  const selectedCategory = watch("type");
  return (
    <div>
      <p className="mb-6 text-sm font-medium text-gray-700">
        이 모임은 어떤 종류인가요?
        <span className="ml-0.5 text-primary-500">*</span>
      </p>

      <div className="grid grid-cols-2 gap-4 min-[744px]:grid-cols-3">
        {MEETING_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.value;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() =>
                setValue("type", category.value, {
                  shouldValidate: true,
                })
              }
              className={`
    aspect-square rounded-2xl p-px cursor-pointer
    ${isSelected ? "bg-mint-gradient-500" : "bg-transparent"}
  `}
            >
              <div
                className={`
      flex h-full w-full flex-col items-center justify-center
      gap-5 rounded-[15px] hover:bg-gray-200 transition
      ${isSelected ? "bg-mint-gradient-100" : "bg-gray-100"}
    `}
              >
                <Image
                  src={category.icon}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 object-contain"
                />

                <span className="text-sm font-medium text-gray-700">
                  {category.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
