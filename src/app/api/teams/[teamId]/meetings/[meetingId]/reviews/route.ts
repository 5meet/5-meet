import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_CODEIT_API_URL;

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      teamId: string;
      meetingId: string;
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

    const { teamId, meetingId } = await context.params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "로그인이 필요합니다. accessToken 쿠키가 없습니다." },
        { status: 401 },
      );
    }

    const body = await request.json();

    // BASE_URL에 /5-meet이 포함되어 있으므로 teamId를 다시 붙이지 않습니다.
    const baseUrl = BASE_URL.replace(/\/+$/, "");
    const url = `${baseUrl}/meetings/${encodeURIComponent(meetingId)}/reviews`;

    console.info("[리뷰 작성 외부 API 요청]", {
      url,
      teamId,
      meetingId,
      hasAccessToken: Boolean(accessToken),
    });

    const apiResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const responseText = await apiResponse.text();

    let result: unknown = responseText;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch {
      // JSON이 아닌 응답은 문자열로 전달합니다.
    }

    if (!apiResponse.ok) {
      console.error("[리뷰 작성 외부 API 실패]", {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        url,
        responseText,
      });
    }

    return new NextResponse(
      responseText || null,
      {
        status: apiResponse.status,
        headers: {
          "Content-Type":
            apiResponse.headers.get("content-type") ?? "application/json",
        },
      },
    );
  } catch (error) {
    console.error("[리뷰 작성 프록시 오류]", error);

    return NextResponse.json(
      { message: "리뷰 작성 요청 중 서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
