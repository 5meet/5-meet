import { api } from "@/lib/api/api";

import {
  ResponseMessage,
  MeetingDetail,
  MeetingDetailResponse,
  MeetingUpdateRequest,
  MeetingStatus,
  ParticipantResponse,
  ParticipantListResponse,
  GetParticipantsParams,
  ReviewResponse,
  ReviewListResponse,
  GetReviewsParams,
  MeetingListResponse,
  GetMeetingsParams,
  RecommendedMeeting,
  GetRecommendedMeetingsParams,
} from "@/features/meetingDetail/types/meetingDetail";
import {
  convertDateType1,
  convertDateType4,
} from "@/lib/convertDate/formatMeetingDate";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

// 응답 매핑 공통 함수
const mapToMeetingDetail = (res: MeetingDetailResponse): MeetingDetail => {
  const { date, time } = convertDateType1(res.dateTime);

  return {
    id: res.id,
    title: res.name,
    location: res.region,
    category: res.type,
    date,
    time,
    dateTime: res.dateTime,
    registrationEnd: res.registrationEnd,
    capacity: res.capacity,
    participantCount: res.participantCount,
    image: res.image,
    description: res.description,
    address: res.address,
    latitude: res.latitude,
    longitude: res.longitude,
    hostId: res.hostId,
    host: res.host,
    initialIsFavorited: res.isFavorited,
    initialIsParticipating: res.isJoined,
    isCompleted: res.isCompleted,
    canceledAt: res.canceledAt,
    confirmedAt: res.confirmedAt,
  };
};

//-----------------------------------------------------------------

// 모임 상세 조회
export const getMeetingDetail = async (
  meetingId: number,
): Promise<MeetingDetail> => {
  const res = await api
    .get(`${TEAM_ID}/meetings/${meetingId}`)
    .json<MeetingDetailResponse>();

  return mapToMeetingDetail(res);
};

//-----------------------------------------------------------------

// 모임 수정 (주최자)
export const updateMeetingDetail = async (
  meetingId: number,
  payload: MeetingUpdateRequest,
): Promise<MeetingDetail> => {
  const res = await api
    .patch(`${TEAM_ID}/meetings/${meetingId}`, { json: payload })
    .json<MeetingDetailResponse>();

  return mapToMeetingDetail(res);
};

// 모임 삭제 (주최자)
export const deleteMeetingDetail = async (
  meetingId: number,
): Promise<ResponseMessage> => {
  return api.delete(`${TEAM_ID}/meetings/${meetingId}`).json<ResponseMessage>();
};

//-----------------------------------------------------------------

// 모임 참여 (참여자)
export const joinMeeting = async (
  meetingId: number,
): Promise<ResponseMessage> => {
  return api
    .post(`${TEAM_ID}/meetings/${meetingId}/join`)
    .json<ResponseMessage>();
};

// 모임 참여 취소 (참여자)
export const cancelMeeting = async (
  meetingId: number,
): Promise<ResponseMessage> => {
  return api
    .delete(`${TEAM_ID}/meetings/${meetingId}/join`)
    .json<ResponseMessage>();
};

//-----------------------------------------------------------------

// 모임 상태 변경 (주최자)
export const changeMeetingStatus = async (
  meetingId: number,
  status: MeetingStatus,
): Promise<MeetingDetail> => {
  const res = await api
    .patch(`${TEAM_ID}/meetings/${meetingId}/status`, {
      json: { status },
    })
    .json<MeetingDetailResponse>();

  return mapToMeetingDetail(res);
};

//-----------------------------------------------------------------

// 참가자 목록 조회
export const getParticipants = async ({
  meetingId,
  cursor,
  size,
}: GetParticipantsParams): Promise<ParticipantListResponse> => {
  const searchParams = {
    ...(cursor && { cursor }),
    ...(size && { size }),
  };

  const res = await api
    .get(`${TEAM_ID}/meetings/${meetingId}/participants`, { searchParams })
    .json<{
      data: ParticipantResponse[];
      nextCursor: string | null;
      hasMore: boolean;
    }>();

  const list = res.data ?? [];

  const mappedData = list.map((r) => ({
    id: r.user.id,
    name: r.user.name,
    image: r.user.image,
  }));

  return {
    data: mappedData,
    nextCursor: res.nextCursor,
    hasMore: res.hasMore,
  };
};

//-----------------------------------------------------------------

// 특정 모임 리뷰 목록 조회
export const getReviews = async ({
  meetingId,
  cursor,
  size,
}: GetReviewsParams): Promise<ReviewListResponse> => {
  const searchParams = {
    ...(cursor && { cursor }),
    ...(size && { size }),
  };

  const res = await api
    .get(`${TEAM_ID}/meetings/${meetingId}/reviews`, { searchParams })
    .json<{
      data: ReviewResponse[];
      nextCursor: string | null;
      hasMore: boolean;
    }>();

  const list = res.data ?? [];

  const mappedData = list.map((r) => {
    const convertedDate = convertDateType4(new Date(r.createdAt));

    if (!convertedDate) {
      throw new Error(`Invalid datetime: ${r.createdAt}`);
    }

    return {
      id: r.id,
      score: r.score,
      comment: r.comment,
      createdAt: convertedDate,
      user: {
        id: r.user.id,
        name: r.user.name,
        image: r.user.image,
      },
    };
  });

  return {
    data: mappedData,
    nextCursor: res.nextCursor,
    hasMore: res.hasMore,
  };
};

//-----------------------------------------------------------------

// 추천 모임 목록의 기반이 되는 범용 목록 조회 - 추후 삭제
export const getMeetings = async (
  params: GetMeetingsParams,
): Promise<MeetingListResponse> => {
  const searchParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
  );

  return api
    .get(`${TEAM_ID}/meetings`, { searchParams })
    .json<MeetingListResponse>();
};

//-----------------------------------------------------------------

// 추천 모임 목록 조회
const mapToRecommendedMeeting = (
  r: MeetingDetailResponse,
): RecommendedMeeting => ({
  id: r.id,
  title: r.name,
  image: r.image,
  location: r.region,
  category: r.type,
  dateTime: r.dateTime,
  registrationEnd: r.registrationEnd,
  initialIsFavorited: r.isFavorited,
  participantCount: r.participantCount,
  capacity: r.capacity,
});

export const getRecommendedMeetings = async ({
  currentMeetingId,
  category,
  region,
  size = 6,
}: GetRecommendedMeetingsParams): Promise<RecommendedMeeting[]> => {
  const now = new Date().toISOString();

  // 공통: 자기 자신 제외 + 정원 미달 + 아직 시작 전인 모임만
  const postFilter = (list: MeetingDetailResponse[]) =>
    list.filter(
      (m) =>
        m.id !== currentMeetingId &&
        m.canceledAt === null &&
        m.participantCount < m.capacity,
    );

  // 1단계: 같은 카테고리 + 같은 지역, 인기순
  const tier1 = await getMeetings({
    type: category,
    region,
    dateStart: now,
    sortBy: "participantCount",
    sortOrder: "desc",
    size: size * 2,
  });

  let result = postFilter(tier1.data);
  if (result.length >= size) {
    return result.slice(0, size).map(mapToRecommendedMeeting);
  }

  // 2단계: 같은 카테고리만 (지역 조건 완화)
  const tier2 = await getMeetings({
    type: category,
    dateStart: now,
    sortBy: "participantCount",
    sortOrder: "desc",
    size: size * 2,
  });

  const seen = new Set(result.map((m) => m.id));
  result = [
    ...result,
    ...postFilter(tier2.data).filter((m) => !seen.has(m.id)),
  ];
  if (result.length >= size) {
    return result.slice(0, size).map(mapToRecommendedMeeting);
  }

  // 3단계: 조건 없이 인기순 전체 (최후의 fallback)
  const tier3 = await getMeetings({
    dateStart: now,
    sortBy: "participantCount",
    sortOrder: "desc",
    size: size * 2,
  });

  const seen2 = new Set(result.map((m) => m.id));
  result = [
    ...result,
    ...postFilter(tier3.data).filter((m) => !seen2.has(m.id)),
  ];

  return result.slice(0, size).map(mapToRecommendedMeeting);
};
