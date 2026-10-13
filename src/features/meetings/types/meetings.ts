import type {
  MeetingAPIResponse,
  MeetingFront,
} from "@/features/meetingDetail/types/meetingDetail";

export interface MeetingHost {
  id: number;
  name: string;
  image: string | null;
}

export interface Meeting {
  id: number;
  teamId: string;
  name: string;
  description: string;
  type: string;
  image: string | null;

  address: string;
  region: string;
  latitude: number;
  longitude: number;

  dateTime: string;
  registrationEnd: string;

  capacity: number;
  participantCount: number;

  createdBy: number;
  hostId: number;
  host: MeetingHost;

  isCompleted: boolean;
  confirmedAt: string | null;
  canceledAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface MeetingsResponse {
  data: Meeting[];
  hasMore: boolean;
  nextCursor: string | null;
}

//-----------------------------------------

// 모임 목록 조회 파라미터
export interface GetMeetingsParams {
  id?: number;
  type?: string;
  region?: string;
  keyword?: string;
  dateStart?: string; // ISO
  dateEnd?: string; // ISO
  createdBy?: number;
  sortBy?: "dateTime" | "participantCount" | "createdAt";
  sortOrder?: "asc" | "desc";
  cursor?: string | null;
  size?: number;
}

// 모임 목록 조회 응답
export interface MeetingListResponse {
  data: MeetingAPIResponse[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
  currentOffset: number;
  limit: number;
}

// 모임 생성 Request Body
export interface MeetingCreateRequest {
  name: string;
  type: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  dateTime: string; // ISO
  registrationEnd: string; // ISO
  capacity: number;
  image: string;
  description: string;
}

// 모임 생성 폼
export interface MeetingFormValues {
  type: string;
  name: string;
  region: string; // 짧은 지역명 (예: "서울 강남구")
  address: string; // 도로명 주소 (검색 결과)
  detailAddress: string; // 상세 주소 (직접 입력)
  latitude: number;
  longitude: number;
  image: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  registrationEndDate: string;
  registrationEndTime: string;
  capacity: number;
}
