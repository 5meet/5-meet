export function MeetingCardSkeleton() {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      aria-hidden="true"
    >
      {/* 이미지 */}
      <div className="aspect-16/10 w-full bg-gray-200" />

      {/* 정보 */}
      <div className="p-4">
        {/* 제목 */}
        <div className="h-6 w-2/3 rounded bg-gray-200" />

        {/* 지역 */}
        <div className="mt-2  flex items-center gap-1 h-5">
          <div className="size-3.5 rounded-full bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-200" />
        </div>

        {/* 날짜 / 인원 */}
        <div className="mt-4 flex items-center justify-between h-5">
          <div className="flex items-center gap-1.5">
            <div className="size-4 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>

          <div className="flex items-center gap-1">
            <div className="size-4 rounded bg-gray-200" />
            <div className="h-4 w-10 rounded bg-gray-200" />
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-4 flex gap-2">
          <div className="size-10 shrink-0 rounded-full bg-gray-200" />
          <div className="h-10 flex-1 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
