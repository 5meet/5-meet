import { http, HttpResponse } from "msw";
import {
  mockMeetingResponse,
  mockParticipantsResponse,
  mockReviewsResponseAll,
  mockRecommendedResponseAll,
} from "@/features/meetingDetail/mockData";

const API_BASE = process.env.NEXT_PUBLIC_CODEIT_API_URL;

// service.ts가 호출하는 경로 그대로 매칭 (TEAM_ID 접두사 없이 `meetings/...`로 요청 중)
export const handlers = [
  // 모임 상세 조회
  http.get(`${API_BASE}/meetings/:meetingId`, ({ params }) => {
    return HttpResponse.json({
      ...mockMeetingResponse,
      id: Number(params.meetingId),
    });
  }),

  // 모임 수정
  http.patch(`${API_BASE}/meetings/:meetingId`, async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      ...mockMeetingResponse,
      ...body,
      id: Number(params.meetingId),
    });
  }),

  // 모임 삭제
  http.delete(`${API_BASE}/meetings/:meetingId`, () => {
    return HttpResponse.json({ message: "모임이 삭제되었습니다." });
  }),

  // 모임 참여 / 취소
  http.post(`${API_BASE}/meetings/:meetingId/join`, () => {
    return HttpResponse.json({ message: "모임 참여가 완료되었습니다." });
  }),
  http.delete(`${API_BASE}/meetings/:meetingId/join`, () => {
    return HttpResponse.json({ message: "참여가 취소되었습니다." });
  }),

  // 모임 상태 변경
  http.patch(
    `${API_BASE}/meetings/:meetingId/status`,
    async ({ request, params }) => {
      const body = (await request.json()) as { status: string };
      return HttpResponse.json({
        ...mockMeetingResponse,
        id: Number(params.meetingId),
        confirmedAt:
          body.status === "CONFIRMED" ? new Date().toISOString() : null,
        canceledAt:
          body.status === "CANCELED" ? new Date().toISOString() : null,
      });
    },
  ),

  // 참가자 목록 (cursor 기반)
  http.get(`${API_BASE}/meetings/:meetingId/participants`, ({ request }) => {
    const url = new URL(request.url);
    const size = Number(url.searchParams.get("size") ?? 20);
    const cursor = url.searchParams.get("cursor");
    const start = cursor ? Number(cursor) : 0;
    const end = start + size;

    return HttpResponse.json({
      data: mockParticipantsResponse.slice(start, end),
      nextCursor: end < mockParticipantsResponse.length ? String(end) : null,
      hasMore: end < mockParticipantsResponse.length,
    });
  }),

  // 리뷰 목록 (cursor 기반)
  http.get(`${API_BASE}/meetings/:meetingId/reviews`, ({ request }) => {
    const url = new URL(request.url);
    const size = Number(url.searchParams.get("size") ?? 5);
    const cursor = url.searchParams.get("cursor");
    const start = cursor ? Number(cursor) : 0;
    const end = start + size;

    return HttpResponse.json({
      data: mockReviewsResponseAll.slice(start, end),
      nextCursor: end < mockReviewsResponseAll.length ? String(end) : null,
      hasMore: end < mockReviewsResponseAll.length,
    });
  }),

  // 모임 목록 조회 (추천 모임의 기반)
  http.get(`${API_BASE}/meetings`, ({ request }) => {
    const url = new URL(request.url);
    const size = Number(url.searchParams.get("size") ?? 6);

    return HttpResponse.json({
      data: mockRecommendedResponseAll.slice(0, size),
      nextCursor: null,
      hasMore: false,
      totalCount: mockRecommendedResponseAll.length,
      currentOffset: 0,
      limit: size,
    });
  }),

  // 찜하기 추가/삭제 (API 명세 추정 — 확정되면 경로/메서드 교체 필요)
  http.post(`${API_BASE}/meetings/:meetingId/favorite`, () => {
    return HttpResponse.json({ message: "찜 목록에 추가되었습니다." });
  }),
  http.delete(`${API_BASE}/meetings/:meetingId/favorite`, () => {
    return HttpResponse.json({ message: "찜 목록에서 삭제되었습니다." });
  }),

  // 이미지 업로드 (presigned URL 발급)
  http.post(`${API_BASE}/images`, async ({ request }) => {
    const body = (await request.json()) as { fileName: string };
    return HttpResponse.json({
      presignedUrl: `${API_BASE}/mock-upload/${encodeURIComponent(body.fileName)}`,
      publicUrl: `https://example.com/mock-images/${encodeURIComponent(body.fileName)}`,
    });
  }),

  // presignedUrl로 실제 파일을 PUT하는 요청도 mock (실패 없이 통과시킴)
  http.put(`${API_BASE}/mock-upload/:fileName`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
