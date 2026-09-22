"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_FIND_FILTERS,
  filtersToSearchParams,
  parseFindFilters,
} from "../api/query";
import type { MeetingsFindFilters } from "../api/types";
import { useDebouncedValue } from "./useDebouncedValue";

export function useFindFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const fromUrl = useMemo(
    () => parseFindFilters(new URLSearchParams(searchKey)),
    [searchKey],
  );

  const [filters, setFilters] = useState<MeetingsFindFilters>(fromUrl);
  const debouncedKeyword = useDebouncedValue(filters.keyword, 300);
  const queryFilters = useMemo(
    () => ({ ...filters, keyword: debouncedKeyword }),
    [debouncedKeyword, filters],
  );

  useEffect(() => {
    const next = filtersToSearchParams(queryFilters).toString();
    if (next === searchKey) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [pathname, queryFilters, router, searchKey]);

  const patchFilters = useCallback((patch: Partial<MeetingsFindFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FIND_FILTERS);
  }, []);

  return { filters, queryFilters, patchFilters, resetFilters };
}
