export interface ReviewApiItem {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;

  user?: {
    id: number;
    email: string;
    name: string;
    image: string | null;
  };

  meeting?: {
    id: number;
    name: string;
    type: string;
    region: string;
    image: string;
    dateTime: string;
  };
}

export interface GetReviewsResponse {
  data: ReviewApiItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GetReviewsParams {
  meetingId?: number;
  userId?: number;
  type?: string;
  region?: string;
  dateStart?: string;
  dateEnd?: string;
  registrationEndStart?: string;
  registrationEndEnd?: string;
  sortBy?:
    | "createdAt"
    | "score"
    | "participantCount";
  sortOrder?: "asc" | "desc";
  cursor?: string;
  size?: number;
}

export interface ReviewStatistics {
  averageScore: number;
  totalReviews: number;
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
}

export interface ReviewCategoryStatistics {
  type: string;
  averageScore: number;
  totalReviews: number;
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
}

export type ReviewCategoryStatisticsResponse =
  ReviewCategoryStatistics[];