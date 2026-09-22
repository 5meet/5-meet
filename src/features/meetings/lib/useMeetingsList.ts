"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiError } from "@/lib/api/handleApiError";
import { getMeetings } from "../api/meetings";
import {
  filtersToListParams,
  filtersToPopularParams,
} from "../api/query";
import type { Meeting, MeetingsFindFilters } from "../api/types";

type ListState = {
  meetings: Meeting[];
  popular: Meeting[];
  nextCursor: string | null;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  errorMessage: string | null;
};

const INITIAL_STATE: ListState = {
  meetings: [],
  popular: [],
  nextCursor: null,
  hasMore: false,
  loading: true,
  loadingMore: false,
  errorMessage: null,
};

export function useMeetingsList(filters: MeetingsFindFilters) {
  const [state, setState] = useState<ListState>(INITIAL_STATE);
  const listParams = useMemo(() => filtersToListParams(filters), [filters]);
  const popularParams = useMemo(
    () => filtersToPopularParams(filters),
    [filters],
  );

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({
      ...current,
      loading: true,
      errorMessage: null,
      loadingMore: false,
    }));

    Promise.all([getMeetings(listParams), getMeetings(popularParams)])
      .then(([listPage, popularPage]) => {
        if (cancelled) return;
        setState({
          meetings: listPage.data,
          popular: popularPage.data,
          nextCursor: listPage.nextCursor,
          hasMore: listPage.hasMore,
          loading: false,
          loadingMore: false,
          errorMessage: null,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({
          ...INITIAL_STATE,
          loading: false,
          errorMessage: getApiError(error).message,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [listParams, popularParams]);

  const loadMore = useCallback(async () => {
    if (!state.hasMore || !state.nextCursor || state.loadingMore) return;

    setState((current) => ({ ...current, loadingMore: true }));
    try {
      const page = await getMeetings({
        ...listParams,
        cursor: state.nextCursor,
      });
      setState((current) => ({
        ...current,
        meetings: [...current.meetings, ...page.data],
        nextCursor: page.nextCursor,
        hasMore: page.hasMore,
        loadingMore: false,
      }));
    } catch (error: unknown) {
      setState((current) => ({
        ...current,
        loadingMore: false,
        errorMessage: getApiError(error).message,
      }));
    }
  }, [listParams, state.hasMore, state.nextCursor, state.loadingMore]);

  return { ...state, loadMore };
}
