// 모임 상세 정보 카드 (MeetingDetail/InfoCard.tsx)
export interface MeetingDetailInfoCardProps {
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

// PersonnelCard (+ 참여자 목록, progressbar 컴포넌트)
export interface ParticipantProfile {
  id: string;
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

// ReviewCard
export interface UserProfile {
  id: string;
  name: string;
  image: string | null;
}

export interface Review {
  id: string;
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
