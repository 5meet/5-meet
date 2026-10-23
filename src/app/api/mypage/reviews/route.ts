import { NextRequest, NextResponse } from "next/server";
import type { User } from "@/features/auth/type";
import {
  getMyReviews,
  type MyReviewsSortBy,
  type MyReviewsSortOrder,
} from "@/features/mypage/api/getMyReviews";
import { ApiError } from "@/lib/api/ApiError";
import { serverFetchWithTokenRefresh } from "@/lib/api/serverFetchWithTokenRefresh";

const SORT_BY_VALUES: MyReviewsSortBy[] = ["createdAt", "score"];

const SORT_ORDER_VALUES: MyReviewsSortOrder[] = ["asc", "desc"];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");
    const sizeParam = searchParams.get("size");
    const cursor = searchParams.get("cursor");

    const sortBy =
      sortByParam &&
      SORT_BY_VALUES.includes(sortByParam as MyReviewsSortBy)
        ? (sortByParam as MyReviewsSortBy)
        : "createdAt";

    const sortOrder =
      sortOrderParam &&
      SORT_ORDER_VALUES.includes(sortOrderParam as MyReviewsSortOrder)
        ? (sortOrderParam as MyReviewsSortOrder)
        : "desc";

    const parsedSize = sizeParam ? Number(sizeParam) : 10;
    const size =
      Number.isInteger(parsedSize) &&
      parsedSize > 0 &&
      parsedSize <= 100
        ? parsedSize
        : 10;

    const data = await getMyReviews({
      sortBy,
      sortOrder,
      size,
      cursor: cursor ?? undefined,
      teamId: "",
    });

    // 작성자 이름이 없는 리뷰에 한해 현재 로그인한 사용자 정보를 보완한다.
    const needsCurrentUser = data.data.some(
      (review) => !review.user?.name?.trim(),
    );

    let currentUser: User | undefined;

    if (needsCurrentUser) {
      currentUser = await serverFetchWithTokenRefresh<User>("/users/me", {
        method: "GET",
        cache: "no-store",
      });
    }

    const reviews = data.data.map((review) => {
      if (review.user?.name?.trim()) {
        return review;
      }

      return {
        ...review,
        user: currentUser
          ? {
              id: currentUser.id,
              email: currentUser.email,
              name: currentUser.name,
              image: currentUser.image,
            }
          : undefined,
      };
    });

    return NextResponse.json({
      ...data,
      data: reviews,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("[마이페이지 리뷰 API JSON 파싱 오류]", error);

      return NextResponse.json(
        { message: "백엔드 응답을 JSON으로 읽지 못했습니다." },
        { status: 500 },
      );
    }

    if (error instanceof ApiError) {
      console.error("[마이페이지 리뷰 API 오류]", {
        message: error.message,
        status: error.status,
        code: error.code,
      });

      return NextResponse.json(
        {
          message: error.message,
          code: error.code,
        },
        { status: error.status ?? 500 },
      );
    }

    console.error("[마이페이지 리뷰 API 서버 오류]", error);

    return NextResponse.json(
      { message: "알 수 없는 서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}