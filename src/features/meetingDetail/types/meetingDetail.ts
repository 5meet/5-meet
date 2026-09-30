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
  address: string;
  latitude: number;
  longitude: number;
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

// API 응답의 user 객체
export interface ParticipantUserResponse {
  id: number;
  name: string;
  image: string | null;
}

// API 원본 응답
export interface ParticipantResponse {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  joinedAt: string;
  user: ParticipantUserResponse;
}

export interface ParticipantListResponse {
  data: ParticipantProfile[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GetParticipantsParams extends PaginationParmas {
  meetingId: number;
}

//-----------------------------------------------------------------

// 모임 수정 Request Body
export interface MeetingUpdateRequest {
  name: string;
  type: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  image: string;
  description: string;
}

//-----------------------------------------------------------------

// 모임 상태
export type MeetingStatus = "CONFIRMED" | "CANCELED";

// 모임 상태 변경 요청 Body
export interface MeetingStatusUpdateRequest {
  status: MeetingStatus;
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

// API 응답의 user 객체 (email 포함)
export interface ReviewUserResponse {
  id: number;
  email: string;
  name: string;
  image: string | null;
}

// API 응답의 meeting 객체
export interface ReviewMeetingResponse {
  id: number;
  name: string;
  type: string;
  region: string;
  image: string;
  dateTime: string;
}

export interface ReviewResponse {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUserResponse;
  meeting: ReviewMeetingResponse;
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

// 추천 모임 목록
export interface MeetingListResponse {
  data: MeetingDetailResponse[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
  currentOffset: number;
  limit: number;
}

export interface GetMeetingsParams {
  id?: number;
  type?: string;
  region?: string;
  keyword?: string;
  dateStart?: string;
  dateEnd?: string;
  createdBy?: number;
  sortBy?: "dateTime" | "participantCount" | "createdAt";
  sortOrder?: "asc" | "desc";
  cursor?: string | null;
  size?: number;
}

// 추천 카드(CompactCard)에 필요한 최소 도메인 타입
export interface RecommendedMeeting {
  id: number;
  title: string;
  image: string;
  location: string;
  category: string;
  dateTime: string;
  registrationEnd: string;
  initialIsFavorited: boolean;
  participantCount: number;
  capacity: number;
}

export interface GetRecommendedMeetingsParams {
  currentMeetingId: number;
  category: string;
  region: string;
  size?: number;
}

//-----------------------------------------------------------------

// Pagination Params
export interface PaginationParmas {
  cursor?: string | null;
  size?: number;
}

// API 성공 응답 메세지
export interface ResponseMessage {
  message: string;
}
