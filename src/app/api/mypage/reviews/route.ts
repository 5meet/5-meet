import { NextRequest, NextResponse } from "next/server";

import {
  getMyReviews,
  type MyReviewsSortBy,
  type MyReviewsSortOrder,
} from "@/features/mypage/api/getMyReviews";

const SORT_BY_VALUES: MyReviewsSortBy[] = [
  "createdAt",
  "score",
];

const SORT_ORDER_VALUES: MyReviewsSortOrder[] = [
  "asc",
  "desc",
];

export async function GET(request: NextRequest) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const sortByParam =
      searchParams.get("sortBy");

    const sortOrderParam =
      searchParams.get("sortOrder");

    const sizeParam =
      searchParams.get("size");

    const cursor =
      searchParams.get("cursor");

    const sortBy =
      sortByParam &&
      SORT_BY_VALUES.includes(
        sortByParam as MyReviewsSortBy,
      )
        ? (sortByParam as MyReviewsSortBy)
        : "createdAt";

    const sortOrder =
      sortOrderParam &&
      SORT_ORDER_VALUES.includes(
        sortOrderParam as MyReviewsSortOrder,
      )
        ? (sortOrderParam as MyReviewsSortOrder)
        : "desc";

    const parsedSize = sizeParam
      ? Number(sizeParam)
      : 10;

    const size =
      Number.isInteger(parsedSize) &&
      parsedSize > 0
        ? parsedSize
        : 10;

    const data = await getMyReviews({
      sortBy,
      sortOrder,
      size,
      cursor: cursor ?? undefined,
      teamId: "",
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "GET /api/mypage/reviews failed:",
      error,
    );

    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        message:
          "작성한 리뷰를 불러오지 못했어요.",
      },
      {
        status: 500,
      },
    );
  }
}