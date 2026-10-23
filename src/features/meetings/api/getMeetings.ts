import { api } from "@/lib/api/api";
import type { MeetingsResponse } from "@/features/meetings/types/meetings"

interface GetMeetingsParams {
  keyword?: string;
  cursor?: string;
  size?: number;

  type?: string;
  region?: string;
  dateStart?: string;
  dateEnd?: string;
  sortBy?: "registrationEnd";
  sortOrder?: "asc" | "desc";
}

export async function getMeetings({
  keyword,
  cursor,
  size = 20,
  type,
  region,
  dateStart,
  dateEnd,
  sortBy,
  sortOrder,
}: GetMeetingsParams): Promise<MeetingsResponse> {
  const searchParams = new URLSearchParams();

  searchParams.set("size", String(size));

  if (keyword) {
    searchParams.set("keyword", keyword);
  }

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  if (type) {
    searchParams.set("type", type);
  }

  if (region) {
    searchParams.set("region", region);
  }

  if (dateStart) {
    searchParams.set("dateStart", dateStart);
  }

  if (dateEnd) {
    searchParams.set("dateEnd", dateEnd);
  }

  if (sortBy) {
    searchParams.set("sortBy", sortBy);
  }

  if (sortOrder) {
    searchParams.set("sortOrder", sortOrder);
  }

  return api
    .get("/meetings", { searchParams })
    .json<MeetingsResponse>();
}