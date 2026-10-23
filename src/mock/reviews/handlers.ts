
import { http, HttpResponse } from "msw";

const now = new Date();

const daysAgo = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

interface MockMeeting {
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
  host: { id: number; name: string; image: string | null };
  isFavorited: boolean;
  isJoined: boolean;
  isCompleted: boolean;
  joinedAt: string | null;
  isReviewed: boolean;
  role: string;
}

interface MockReview {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

const meetings: MockMeeting[] = [
  {
    id: 97001,
    teamId: "mock-team",
    name: "테스트 완료 모임 1",
    type: "STUDY",
    region: "서울",
    address: "서울특별시 강남구",
    latitude: 37.4979,
    longitude: 127.0276,
    dateTime: daysAgo(3),
    registrationEnd: daysAgo(4),
    capacity: 6,
    participantCount: 4,
    image: "",
    description: "리뷰 CRUD 테스트용 모임",
    canceledAt: null,
    confirmedAt: daysAgo(5),
    hostId: 1,
    createdBy: 1,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3),
    host: { id: 1, name: "테스트 호스트", image: null },
    isFavorited: false,
    isJoined: true,
    isCompleted: true,
    joinedAt: daysAgo(8),
    isReviewed: false,
    role: "MEMBER",
  },
  {
    id: 97002,
    teamId: "mock-team",
    name: "테스트 완료 모임 2",
    type: "STUDY",
    region: "서울",
    address: "서울특별시 마포구",
    latitude: 37.5665,
    longitude: 126.978,
    dateTime: daysAgo(5),
    registrationEnd: daysAgo(6),
    capacity: 8,
    participantCount: 5,
    image: "",
    description: "리뷰 수정 및 삭제 테스트용 모임",
    canceledAt: null,
    confirmedAt: daysAgo(7),
    hostId: 1,
    createdBy: 1,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(5),
    host: { id: 1, name: "테스트 호스트", image: null },
    isFavorited: false,
    isJoined: true,
    isCompleted: true,
    joinedAt: daysAgo(9),
    isReviewed: false,
    role: "MEMBER",
  },
  {
    id: 97003,
    teamId: "mock-team",
    name: "테스트 완료 모임 3",
    type: "STUDY",
    region: "서울",
    address: "서울특별시 송파구",
    latitude: 37.5145,
    longitude: 127.1059,
    dateTime: daysAgo(7),
    registrationEnd: daysAgo(8),
    capacity: 10,
    participantCount: 7,
    image: "",
    description: "동시 요청 테스트용 모임",
    canceledAt: null,
    confirmedAt: daysAgo(9),
    hostId: 1,
    createdBy: 1,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(7),
    host: { id: 1, name: "테스트 호스트", image: null },
    isFavorited: false,
    isJoined: true,
    isCompleted: true,
    joinedAt: daysAgo(11),
    isReviewed: false,
    role: "MEMBER",
  },
];

const reviews = new Map<number, MockReview>();
let nextReviewId = 98000;

function getReviewList() {
  return [...reviews.values()]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .map((review) => {
      const meeting = meetings.find(
        (item) => item.id === review.meetingId,
      );

      return {
        ...review,
        user: {
          id: review.userId,
          name: "테스트 사용자",
          email: "test@example.com",
          image: null,
        },
        meeting: meeting
          ? {
              id: meeting.id,
              name: meeting.name,
              type: meeting.type,
              region: meeting.region,
              image: meeting.image,
              dateTime: meeting.dateTime,
            }
          : undefined,
      };
    });
}

function validReviewBody(body: unknown): body is {
  score: number;
  comment: string;
} {
  if (!body || typeof body !== "object") return false;

  const value = body as Record<string, unknown>;

  return (
    Number.isInteger(value.score) &&
    Number(value.score) >= 1 &&
    Number(value.score) <= 5 &&
    typeof value.comment === "string" &&
    value.comment.trim().length > 0
  );
}

export const reviewHandlers = [
  // 작성 가능한 리뷰 목록
  http.get("/api/mypage/available-reviews", ({ request }) => {
    const url = new URL(request.url);
    const size = Math.max(1, Number(url.searchParams.get("size")) || 10);
    const cursor = url.searchParams.get("cursor");
    const start = cursor ? Math.max(0, Number(cursor) || 0) : 0;

    const available = meetings.filter(
      (meeting) =>
        ![...reviews.values()].some(
          (review) => review.meetingId === meeting.id,
        ),
    );

    const data = available.slice(start, start + size);
    const hasMore = start + size < available.length;

    return HttpResponse.json({
      data,
      nextCursor: hasMore ? String(start + size) : null,
      hasMore,
    });
  }),

  // 내가 작성한 리뷰 목록
  http.get("/api/mypage/reviews", ({ request }) => {
    const url = new URL(request.url);
    const size = Math.max(1, Number(url.searchParams.get("size")) || 10);
    const cursor = url.searchParams.get("cursor");
    const start = cursor ? Math.max(0, Number(cursor) || 0) : 0;

    const allReviews = getReviewList();
    const data = allReviews.slice(start, start + size);
    const hasMore = start + size < allReviews.length;

    return HttpResponse.json({
      data,
      nextCursor: hasMore ? String(start + size) : null,
      hasMore,
    });
  }),

  // 리뷰 작성
  http.post(
    "/api/teams/:teamId/meetings/:meetingId/reviews",
    async ({ params, request }) => {
      const meetingId = Number(params.meetingId);
      const meeting = meetings.find((item) => item.id === meetingId);

      if (!meeting) {
        return HttpResponse.json(
          { message: "테스트 모임을 찾을 수 없습니다." },
          { status: 404 },
        );
      }

      if (
        [...reviews.values()].some(
          (review) => review.meetingId === meetingId,
        )
      ) {
        return HttpResponse.json(
          { message: "이미 리뷰를 작성했습니다." },
          { status: 409 },
        );
      }

      const body: unknown = await request.json();

      if (!validReviewBody(body)) {
        return HttpResponse.json(
          { message: "평점은 1~5점이며 리뷰 내용을 입력해야 합니다." },
          { status: 400 },
        );
      }

      const timestamp = new Date().toISOString();
      const review: MockReview = {
        id: nextReviewId++,
        teamId: String(params.teamId),
        meetingId,
        userId: 1,
        score: body.score,
        comment: body.comment.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      reviews.set(review.id, review);
      meeting.isReviewed = true;

      return HttpResponse.json(review, { status: 201 });
    },
  ),

  // 리뷰 수정
  http.patch(
    "/api/teams/:teamId/reviews/:reviewId",
    async ({ params, request }) => {
      const reviewId = Number(params.reviewId);
      const existing = reviews.get(reviewId);

      if (!existing) {
        return HttpResponse.json(
          { message: "수정할 리뷰를 찾을 수 없습니다." },
          { status: 404 },
        );
      }

      const body: unknown = await request.json();

      if (!validReviewBody(body)) {
        return HttpResponse.json(
          { message: "평점은 1~5점이며 리뷰 내용을 입력해야 합니다." },
          { status: 400 },
        );
      }

      const updated: MockReview = {
        ...existing,
        score: body.score,
        comment: body.comment.trim(),
        updatedAt: new Date().toISOString(),
      };

      reviews.set(reviewId, updated);

      return HttpResponse.json(updated);
    },
  ),

  // 리뷰 삭제
  http.delete(
    "/api/teams/:teamId/reviews/:reviewId",
    ({ params }) => {
      const reviewId = Number(params.reviewId);
      const existing = reviews.get(reviewId);

      if (!existing) {
        return HttpResponse.json(
          { message: "삭제할 리뷰를 찾을 수 없습니다." },
          { status: 404 },
        );
      }

      reviews.delete(reviewId);

      const meeting = meetings.find(
        (item) => item.id === existing.meetingId,
      );

      if (meeting) meeting.isReviewed = false;

      return new HttpResponse(null, { status: 204 });
    },
  ),
];
