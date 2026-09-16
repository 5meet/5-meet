import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description?: string;
  moreHref?: string;
  icon?: ReactNode;
};

export function SectionHeader({
  title,
  description,
  moreHref,
  icon,
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          {icon}
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
      {moreHref ? (
        <Link
          href={moreHref}
          className="inline-flex items-center gap-0.5 text-sm font-medium text-gray-500 focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
