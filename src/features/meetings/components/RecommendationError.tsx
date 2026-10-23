"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button/Button";

export function RecommendationError() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative col-span-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:max-[745px]:w-[calc((100%-2rem)/2)]">
      {/* EmptyState와 동일하게 MeetingCard 높이를 확보합니다. */}
      <div aria-hidden="true">
        <div className="aspect-16/10 w-full min-[744px]:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-6rem)/4)]" />
        <div className="h-44" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <p role="status" className="max-w-xs text-sm text-gray-700">
          추천 모임을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <Button
          type="button"
          className="mt-4 w-auto px-4"
          isLoading={isPending}
          onClick={() => startTransition(() => router.refresh())}
        >
          다시 시도
        </Button>
      </div>
    </div>
  );
}
