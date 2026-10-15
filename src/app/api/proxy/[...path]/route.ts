import { NextRequest, NextResponse } from "next/server";

import { bffFetch } from "@/lib/api/bffFetch";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

// BFF를 통해 접근할 수 있는 백엔드 API 그룹
const ALLOWED_PATHS = new Set(["users", "meetings"]);

async function handleRequest(
  request: NextRequest,
  context: RouteContext,
) {
  const { path } = await context.params;
  const method = request.method as HttpMethod;

  // 1. 허용된 API 그룹인지 검증
  if (
    path.length === 0 ||
    !ALLOWED_PATHS.has(path[0]) ||
    path.some((segment) => segment === "." || segment === "..")
  ) {
    return NextResponse.json(
      {
        code: "NOT_FOUND",
        message: "허용되지 않은 API 요청입니다.",
      },
      { status: 404 },
    );
  }

  // 2. GET, DELETE를 제외한 요청 본문 읽기
  const body =
    method === "GET" || method === "DELETE"
      ? undefined
      : await request.text();

  // 3. 쿼리 파라미터 포함
  const query = request.nextUrl.search;
  const apiPath = `${path.join("/")}${query}`;

  try {
    // 4. 공통 BFF 요청
    const response = await bffFetch(apiPath, {
      method,
      body,
    });

    // 5. 백엔드 응답 전달
    return new NextResponse(
      response.status === 204 ? null : response.body,
      {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("Content-Type") ?? "application/json",
        },
      },
    );
  } catch (error) {
    // 6. 요청 시간 초과
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        {
          code: "TIMEOUT_ERROR",
          message: "요청 시간이 초과되었습니다. 다시 시도해주세요.",
        },
        { status: 504 },
      );
    }

    // 7. 네트워크 연결 실패
    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          code: "NETWORK_ERROR",
          message: "API 서버에 연결할 수 없습니다.",
        },
        { status: 502 },
      );
    }

    // 8. 예상하지 못한 오류
    console.error("BFF REQUEST FAILED:", error);

    return NextResponse.json(
      {
        code: "UNKNOWN_ERROR",
        message: "요청 처리 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PATCH = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;