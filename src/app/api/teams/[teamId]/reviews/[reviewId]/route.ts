import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_CODEIT_API_URL;

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{
      teamId: string;
      reviewId: string;
    }>;
  },
) {
  try {
    if (!BASE_URL) {
      return NextResponse.json(
        { message: "API 기본 URL이 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const { teamId, reviewId } = await context.params;

    if (!Number.isInteger(Number(reviewId)) || Number(reviewId) <= 0) {
      return NextResponse.json(
        { message: "올바르지 않은 리뷰 ID입니다." },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const baseUrl = BASE_URL.replace(/\/+$/, "");
    const normalizedTeamId = encodeURIComponent(teamId);

    // BASE_URL에 이미 teamId가 포함되어 있다면 중복해서 붙이지 않습니다.
    const urlObject = new URL(baseUrl);
    const pathSegments = urlObject.pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments.at(-1);

    const teamBaseUrl =
      lastSegment === teamId
        ? baseUrl
        : `${baseUrl}/${normalizedTeamId}`;

    const url = `${teamBaseUrl}/reviews/${encodeURIComponent(reviewId)}`;

    console.info("[리뷰 삭제 API 요청]", {
      url,
      reviewId,
      hasAccessToken: true,
    });

    const apiResponse = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const responseText = await apiResponse.text();

    let result: unknown = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch {
      result = responseText;
    }

    if (!apiResponse.ok) {
      console.error("[외부 리뷰 삭제 API 실패]", {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        url,
        response: result,
      });
    }

    return NextResponse.json(
      result ?? { message: "요청이 처리되었습니다." },
      { status: apiResponse.status },
    );
  } catch (error) {
    console.error("[리뷰 삭제 서버 오류]", error);

    return NextResponse.json(
      { message: "리뷰 삭제 중 서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      teamId: string;
      reviewId: string;
    }>;
  },
) {
  try {
    if (!BASE_URL) {
      return NextResponse.json(
        { message: "API 기본 URL이 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const { teamId, reviewId } = await context.params;

    if (!Number.isInteger(Number(reviewId)) || Number(reviewId) <= 0) {
      return NextResponse.json(
        { message: "올바르지 않은 리뷰 ID입니다." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { score, comment } = body;

    if (
      !Number.isInteger(score) ||
      score < 1 ||
      score > 5 ||
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return NextResponse.json(
        { message: "별점과 리뷰 내용을 확인해 주세요." },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const baseUrl = BASE_URL.replace(/\/+$/, "");
    const normalizedTeamId = encodeURIComponent(teamId);

    const urlObject = new URL(baseUrl);
    const pathSegments = urlObject.pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments.at(-1);

    const teamBaseUrl =
      lastSegment === teamId
        ? baseUrl
        : `${baseUrl}/${normalizedTeamId}`;

    const url = `${teamBaseUrl}/reviews/${encodeURIComponent(reviewId)}`;

    const apiResponse = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        score,
        comment: comment.trim(),
      }),
      cache: "no-store",
    });

    const responseText = await apiResponse.text();
    let result: unknown = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch {
      result = { message: responseText };
    }

    return NextResponse.json(
      result ?? { message: "리뷰 수정 요청이 처리되었습니다." },
      { status: apiResponse.status },
    );
  } catch (error) {
    console.error("[리뷰 수정 서버 오류]", error);

    return NextResponse.json(
      { message: "리뷰 수정 중 서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}