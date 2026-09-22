// 모임 상세 정보 카드 UI
export interface MeetingDetailInfoCardProps {
  id: number;
  title: string;
  location: string;
  category: string;
  dateTime: string;
  registrationEnd: string;
  isOwner: boolean;
  initialIsParticipating: boolean;
  participantCount: number;
  capacity: number;
  initialIsFavorited: boolean;
  isLoggedIn: boolean;
}

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
  datetime: string;
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

export interface ReviewPage {
  data: Review[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GetReviewsParams {
  meetingId: string | number;
  cursor?: string | null;
  size?: number;
}
