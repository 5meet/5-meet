type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="relative col-span-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* MeetingCard의 이미지 비율과 정보 영역 높이에 맞춰 공간을 확보합니다. */}
      <div aria-hidden="true">
        <div className="aspect-16/10 w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-6rem)/4)]" />
        <div className="h-44" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <svg
            viewBox="0 0 48 48"
            className="h-8 w-8 text-primary-500"
            fill="none"
            aria-hidden
          >
            <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="3" />
            <path
              d="M28 28 L38 38"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {description ? (
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
