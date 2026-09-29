// 모임 상세 (컴포넌트 prps)
export interface MeetingDetailInfoCardProps {
  id: number;
  title: string;
  location: string;
  category: string;
  date: string;
  time: string;
  registrationEnd: string;
  isOwner: boolean;
  initialIsParticipating: boolean;
  participantCount: number;
  capacity: number;
  initialIsFavorited: boolean;
  isLoggedIn: boolean;
}

// API 원본 응답
export interface MeetingDetailResponse {
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
}

// 가공 후 도메인 타입
export interface MeetingDetail {
  id: number;
  title: string;
  location: string;
  category: string;
  date: string;
  time: string;
  registrationEnd: string;
  capacity: number;
  participantCount: number;
  image: string;
  description: string;
  hostId: number;
  host: {
    id: number;
    name: string;
    image: string | null;
  };
  initialIsFavorited: boolean;
  initialIsParticipating: boolean;
  isCompleted: boolean;
  canceledAt: string | null;
  confirmedAt: string | null;
}

//-----------------------------------------------------------------

// PersonnelCard (+ 참여자 목록, progressbar 컴포넌트) UI
export interface ParticipantProfile {
  id: number;
  name: string;
  image: string | null;
}

export interface DetailsProgressBarProps {
  participantCount: number;
  capacity: number;
}

export interface ParticipantProfilesProps {
  participants: ParticipantProfile[];
  participantCount: number;
}

export interface PersonnelCardProps extends DetailsProgressBarProps {
  participants: ParticipantProfile[];
}

//-----------------------------------------------------------------

// ReviewCard UI
export interface UserProfile {
  id: number;
  name: string;
  image: string | null;
}

export interface Review {
  id: number;
  user: UserProfile;
  score: number;
  comment: string;
  createdAt: string;
}

export interface ReviewCardProps extends Review {
  isLast?: boolean;
}

export interface ReviewCardListProps {
  reviews: Review[];
}

export interface ReviewResponse {
  id: number;
  score: number;
  comment: string;
  createdAt: string;
  user: UserProfile;
}

export interface ReviewListResponse {
  data: Review[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GetReviewsParams extends PaginationParmas {
  meetingId: number;
}

//-----------------------------------------------------------------

// Pagination Params
export interface PaginationParmas {
  cursor?: string | null;
  size?: number;
}
