import { api } from "@/lib/api/api";

import {
  MeetingId,
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
    registrationEnd: res.registrationEnd,
    capacity: res.capacity,
    participantCount: res.participantCount,
    image: res.image,
    description: res.description,
    hostId: res.hostId,
    host: res.host,
    initialIsFavorited: res.isFavorited,
    initialIsParticipating: res.isJoined,
    isCompleted: res.isCompleted,
    canceledAt: res.canceledAt,
    confirmedAt: res.confirmedAt,
  };
};

// 모임 상세 조회
export const getMeetingDetail = async (
  meetingId: MeetingId,
): Promise<MeetingDetail> => {
  const res = await api
    .get(`${TEAM_ID}/meetings/${meetingId}`)
    .json<MeetingDetailResponse>();

  return mapToMeetingDetail(res);
};

// 모임 수정 (주최자)
export const updateMeetingDetail = async (
  meetingId: MeetingId,
  payload: MeetingUpdateRequest,
): Promise<MeetingDetail> => {
  const res = await api
    .patch(`${TEAM_ID}/meetings/${meetingId}`, { json: payload })
    .json<MeetingDetailResponse>();

  return mapToMeetingDetail(res);
};

// 모임 삭제 (주최자)
export const deleteMeetingDetail = async (
  meetingId: MeetingId,
): Promise<ResponseMessage> => {
  return api.delete(`${TEAM_ID}/meetings/${meetingId}`).json<ResponseMessage>();
};

// 모임 참여 (참여자)
export const joinMeeting = async (
  meetingId: MeetingId,
): Promise<ResponseMessage> => {
  return api
    .post(`${TEAM_ID}/meetings/${meetingId}/join`)
    .json<ResponseMessage>();
};

// 모임 참여 취소 (참여자)
export const cancelMeeting = async (
  meetingId: MeetingId,
): Promise<ResponseMessage> => {
  return api
    .delete(`${TEAM_ID}/meetings/${meetingId}/join`)
    .json<ResponseMessage>();
};

// 모임 상태 변경 (주최자)
export const changeMeetingStatus = async (
  meetingId: MeetingId,
  status: MeetingStatus,
): Promise<MeetingDetail> => {
  const res = await api
    .patch(`${TEAM_ID}/meetings/${meetingId}/status`, {
      json: { status },
    })
    .json<MeetingDetailResponse>();

  return mapToMeetingDetail(res);
};

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

// 추천 모임 목록
// export const getRecommendedMeetings = async ({}): Primise<> => {}
