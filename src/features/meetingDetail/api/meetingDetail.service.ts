import { api } from "@/lib/api/api";

import {
  ReviewResponse,
  ReviewPage,
  GetReviewsParams,
} from "@/features/meetingDetail/types/meetingDetail";
import { convertDateType4 } from "@/lib/convertDate/formatMeetingDate";

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

// 모임 상세 조회 (InfoCard)
// export const getMeetings = async (meeting: string): Promise<> => {
//   const res = await api
//     .get(`${TEAM_ID}/meetings/${meetingId}`)
//     .json<{data: }>();

//   const r = res.data;

//   return {
//     id: r.id,
//   }
// }

// 참가자 목록 조회
// export const getParticipants = async ({
//   cursor,
// }: {
//   cursor: string | null;
// }): Promise<> => {
//   const res = await api
//     .get(`${TEAM_ID}/meetings/${meetingId}/participants`)
//     .json<{data: }>();

//     const list = res.data ?? [];

//     return {
//       data: list.map((r) => ({
//         id: r.id,

//       })),
//       nextCursor:
//     }
// }

// 특정 모임 리뷰 목록 조회
export const getReviews = async ({
  meetingId,
  cursor,
  size,
}: GetReviewsParams): Promise<ReviewPage> => {
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
      datetime: convertedDate,
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
