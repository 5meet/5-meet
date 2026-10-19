"use client";

import { useEffect, useRef } from "react";

interface InfiniteScrollOptions {
  enabled: boolean;
  fetchNextPage: (options: { cancelRefetch: false }) => Promise<unknown>;
}

export function useJoinedMeetingsInfiniteScroll({
  enabled,
  fetchNextPage,
}: InfiniteScrollOptions) {
  const continuationRef = useRef<HTMLDivElement>(null);
  const requestPendingRef = useRef(false);

  useEffect(() => {
    const target = continuationRef.current;
    if (!enabled || !target) return;

    let active = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!active || !entries.some((entry) => entry.isIntersecting) || requestPendingRef.current)
          return;
        requestPendingRef.current = true;
        void fetchNextPage({ cancelRefetch: false })
          .catch(() => {
            // The query exposes the error so the screen can offer manual retry.
          })
          .finally(() => { requestPendingRef.current = false; });
      },
      { rootMargin: "0px 0px 200px 0px" },
    );
    observer.observe(target);
    return () => { active = false; observer.disconnect(); };
  }, [enabled, fetchNextPage]);

  return continuationRef;
}
