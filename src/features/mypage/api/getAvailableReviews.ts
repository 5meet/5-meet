import { serverFetch } from "@/lib/api/serverFetch";

export interface AvailableReviewMeeting {
  id: number;
  teamId: string;
  name: string;
  type: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  participantCount: number;
  image: string;
  description: string;
  canceledAt: string | null;
  confirmedAt: string | null;
  hostId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  host: {
    id: number;
    name: string;
    image: string | null;
  };
  isFavorited: boolean;
  isJoined: boolean;
  isCompleted: boolean;
  joinedAt: string | null;
  isReviewed: boolean;
  role: string;
}

export interface AvailableReviewsResponse {
  data: AvailableReviewMeeting[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface GetAvailableReviewsParams {
  size?: number;
  cursor?: string;
}

export async function getAvailableReviews({
  size = 10,
  cursor,
}: GetAvailableReviewsParams = {}): Promise<AvailableReviewsResponse> {
  const searchParams = new URLSearchParams({
    type: "joined",
    completed: "true",
    reviewed: "false",
    sortBy: "dateTime",
    sortOrder: "desc",
    size: String(size),
  });

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const url = `/users/me/meetings?${searchParams.toString()}`;

  console.log("AVAILABLE REVIEWS REQUEST");
  console.log("url:", url);

  const response = await serverFetch<AvailableReviewsResponse>(
    url,
    {
      auth: true,
    },
  );

  console.log("AVAILABLE REVIEWS RESPONSE");
  console.log("data count:", response.data.length);
  console.log("hasMore:", response.hasMore);
  console.log("nextCursor:", response.nextCursor);
  console.log("data:", response.data);

  return response;
}