import { CATEGORY_CHIPS } from "../constants/filters";
import type { GetMeetingsParams, MeetingsFindFilters } from "./types";

export const MEETINGS_PAGE_SIZE = 10;
export const POPULAR_PAGE_SIZE = 4;

const FILTER_KEYS = [
  "keyword",
  "categoryId",
  "sortId",
  "region",
  "dateStart",
  "dateEnd",
] as const;

export const DEFAULT_FIND_FILTERS: MeetingsFindFilters = {
  keyword: "",
  categoryId: "all",
  sortId: "date",
  region: "",
  dateStart: "",
  dateEnd: "",
};

export function categoryType(categoryId: string): string | undefined {
  if (!categoryId || categoryId === "all") return undefined;
  return CATEGORY_CHIPS.find((chip) => chip.id === categoryId)?.label;
}

export function sortQuery(sortId: string): {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} {
  if (sortId === "date") {
    return { sortBy: "dateTime", sortOrder: "asc" };
  }
  if (sortId === "closing") {
    return { sortBy: "registrationEnd", sortOrder: "asc" };
  }
  if (sortId === "participants") {
    return { sortBy: "participantCount", sortOrder: "desc" };
  }
  return {};
}

export function filtersToListParams(
  filters: MeetingsFindFilters,
): GetMeetingsParams {
  const sort = sortQuery(filters.sortId);
  return {
    type: categoryType(filters.categoryId),
    region: filters.region || undefined,
    keyword: filters.keyword.trim() || undefined,
    dateStart: filters.dateStart || undefined,
    dateEnd: filters.dateEnd || undefined,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    size: MEETINGS_PAGE_SIZE,
  };
}

export function filtersToPopularParams(
  filters: MeetingsFindFilters,
): GetMeetingsParams {
  return {
    type: categoryType(filters.categoryId),
    region: filters.region || undefined,
    keyword: filters.keyword.trim() || undefined,
    dateStart: filters.dateStart || undefined,
    dateEnd: filters.dateEnd || undefined,
    sortBy: "participantCount",
    sortOrder: "desc",
    size: POPULAR_PAGE_SIZE,
  };
}

export function parseFindFilters(
  searchParams: URLSearchParams,
): MeetingsFindFilters {
  const categoryId = searchParams.get("categoryId") ?? DEFAULT_FIND_FILTERS.categoryId;
  const known = CATEGORY_CHIPS.some((chip) => chip.id === categoryId);

  return {
    keyword: searchParams.get("keyword") ?? "",
    categoryId: known ? categoryId : "all",
    sortId: searchParams.get("sortId") ?? DEFAULT_FIND_FILTERS.sortId,
    region: searchParams.get("region") ?? "",
    dateStart: searchParams.get("dateStart") ?? "",
    dateEnd: searchParams.get("dateEnd") ?? "",
  };
}

export function filtersToSearchParams(
  filters: MeetingsFindFilters,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filters[key].trim();
    const fallback = DEFAULT_FIND_FILTERS[key];
    if (value && value !== fallback) {
      params.set(key, value);
    }
  }
  return params;
}

export function findFiltersEqual(
  a: MeetingsFindFilters,
  b: MeetingsFindFilters,
): boolean {
  return FILTER_KEYS.every((key) => a[key] === b[key]);
}
