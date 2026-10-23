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

    const sortByParam = searchParams.get("sortBy") ?? "createdAt";
    const sortOrderParam = searchParams.get("sortOrder") ?? "desc";
    const sizeParam = searchParams.get("size") ?? "10";
    const cursor = searchParams.get("cursor") ?? undefined;

    if (!SORT_BY_VALUES.includes(sortByParam as MyReviewsSortBy)) {
      return NextResponse.json(
        { message: "유효하지 않은 sortBy 값입니다." },
        { status: 400 },
      );
    }

    if (!SORT_ORDER_VALUES.includes(sortOrderParam as MyReviewsSortOrder)) {
      return NextResponse.json(
        { message: "유효하지 않은 sortOrder 값입니다." },
        { status: 400 },
      );
    }

    const size = Number(sizeParam);

    if (!Number.isInteger(size) || size < 1 || size > 100) {
      return NextResponse.json(
        { message: "size는 1~100 사이의 정수여야 합니다." },
        { status: 400 },
      );
    }

    const data = await getMyReviews({
      sortBy: sortByParam as MyReviewsSortBy,
      sortOrder: sortOrderParam as MyReviewsSortOrder,
      size,
      cursor,
    });

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
      return NextResponse.json(
        { message: "백엔드 응답을 JSON으로 읽지 못했습니다." },
        { status: 500 },
      );
    }

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          message: error.message,
          code: error.code,
        },
        { status: error.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "알 수 없는 서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}