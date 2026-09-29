import { api } from "@/lib/api/api";

import {
  MeetingDetail,
  MeetingDetailResponse,
  ReviewResponse,
  ReviewListResponse,
  GetReviewsParams,
} from "@/features/meetingDetail/types/meetingDetail";
import {
  convertDateType1,
  convertDateType4,
} from "@/lib/convertDate/formatMeetingDate";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

// 모임 상세 조회 (InfoCard)
export const getMeetingDetail = async (
  meetingId: number,
): Promise<MeetingDetail> => {
  const res = await api
    .get(`${TEAM_ID}/meetings/${meetingId}`)
    .json<MeetingDetailResponse>();

  const { date, time } = convertDateType1(res.dateTime);

  return {
    id: res.id,
    title: res.name,
    category: res.type,
    location: res.region,
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

// 모임 수정 (주최자)
// export const petchMeetingDetail = async ({}): Primise<> => {}

// 모임 삭제 (주최자)
// export const deleteMeetingDetail = async ({}): Primise<> => {}

// 모임 참여 (참여자)
// export const joinMeeting = async ({}): Primise<> => {}

// 모임 참여 취소 (참여자)
// export const cancelMeeting = async ({}): Primise<> => {}

// 참가자 목록 조회
// export const getParticipants = async ({
//   cursor,
// }: PaginationParmas): Promise<> => {
//   const res = await api
//     .get(`${TEAM_ID}/meetings/${meetingId}/participants`)
//     .json<{
//        data:
//        nextCursor: string | null;
//        hasMore: boolean;
//      }>();

//     const list = res.data ?? [];

//     return {
//       data: list.map((r) => ({
//         id: r.id,

//       })),
//       nextCursor:
//       hasMore:
//     }
// }

// 모임 상태 변경 (주최자)
// export const changeMeetingStatus = async ({}): Primise<> => {}

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
// export const changeMeetingStatus = async ({}): Primise<> => {}
