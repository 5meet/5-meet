"use client";

import { Button } from "@/components/ui/Button/Button";

type LoadMoreButtonProps = {
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};

export function LoadMoreButton({
  hasMore,
  loadingMore,
  onLoadMore,
}: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center pt-2">
      <Button
        type="button"
        variant="secondary"
        onClick={onLoadMore}
        isLoading={loadingMore}
        disabled={loadingMore}
      >
        더 보기
      </Button>
    </div>
  );
}
