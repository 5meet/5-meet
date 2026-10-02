export interface FavoriteMeeting {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  createdAt: string;

  meeting: {
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
      image: string;
    };

    isFavorited: boolean;
    isJoined: boolean;
    isCompleted: boolean;
  };

  isFavorited: boolean;
  isJoined: boolean;
  isCompleted: boolean;
}

export interface GetFavoritesResponse {
  data: FavoriteMeeting[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
  currentOffset: number;
  limit: number;
}

export interface GetFavoritesParams {
  type?: string;
  region?: string;
  dateStart?: string;
  dateEnd?: string;
  sortBy?:
    | "createdAt"
    | "meetingCreatedAt"
    | "dateTime"
    | "registrationEnd"
    | "participantCount";
  sortOrder?: "asc" | "desc";
  cursor?: string;
  offset?: number;
  limit?: number;
  size?: number;
}