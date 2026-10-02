type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-gray-100">
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
  );
}
