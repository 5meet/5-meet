"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorViewProps {
  onRetry: () => void;
  title?: string;
  description?: string;
}

const ErrorView = ({
  onRetry,
  title = "정보를 불러오지 못했습니다.",
  description = "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
}: ErrorViewProps) => {
  return (
    <section
      role="alert"
      className="flex min-h-[320px] w-full flex-col items-center justify-center gap-4 rounded-2xl bg-white px-6 py-12 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertCircle aria-hidden="true" className="h-7 w-7 text-red-500" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="whitespace-pre-line text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <RefreshCw aria-hidden="true" className="h-4 w-4" />
        다시 시도
      </button>
    </section>
  );
};

export default ErrorView;
