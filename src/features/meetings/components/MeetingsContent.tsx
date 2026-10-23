import { cookies } from "next/headers";
import { HeroBanner } from "./HeroBanner";
import { SearchSection } from "./search/SearchSection";
import { Flame, Sparkles } from "lucide-react";

import { MeetingSection } from "./meeting/MeetingSection";
import { serverFetchForPage } from "@/lib/api/serverFetchForPage";
import { unstable_rethrow } from "next/navigation";
import { ApiError } from "@/lib/api/ApiError";

import type { GetFavoritesResponse } from "@/features/favorites/types";
import { getMostFavoriteType } from "@/lib/utils/getMostFavoriteType";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";
import { RecommendationError } from "./RecommendationError";

export async function MeetingsContent() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let mostFavoriteType: string | null = null;
  let hasRecommendationError = false;

  if (accessToken || refreshToken) {
    try {
      const favorites: GetFavoritesResponse["data"] = [];
      const visitedCursors = new Set<string>();
      let cursor: string | null = null;

      while (true) {
        const params = new URLSearchParams();
        if (cursor !== null) params.set("cursor", cursor);
        const query = params.toString();
        const page = await serverFetchForPage<GetFavoritesResponse>(
          query ? `/favorites?${query}` : "/favorites",
          "/meetings",
          { cache: "no-store" },
          true,
        );
        favorites.push(...page.data);

        if (!page.hasMore) break;
        if (!page.nextCursor || visitedCursors.has(page.nextCursor)) {
          // 일부 페이지만 집계하거나 같은 페이지를 무한 조회하지 않도록 합니다.
          throw new Error("찜 목록의 다음 페이지 커서가 올바르지 않습니다.");
        }
        visitedCursors.add(page.nextCursor);
        cursor = page.nextCursor;
      }

      mostFavoriteType = getMostFavoriteType(favorites);
    } catch (error) {
      unstable_rethrow(error);
      if (!(error instanceof ApiError && error.status === 401)) {
        hasRecommendationError = true;
      }
    }
  }

  return (
    <main className="bg-[#f5f7f8] md:py-4">
      <div className="mx-auto w-full md:w-[90%] md:max-w-350">
        <HeroBanner />

        <div className="relative z-10 -mt-6 px-4 md:px-14">
          <SearchSection />
        </div>

        <MeetingSection
          title="지금 인기 있는 모임"
          moreHref="/meetings/list"
          endpoint="/meetings?sortBy=participantCount&sortOrder=desc&size=4"
          icon={<Flame className="h-5 w-5 text-orange-500" />}
        />

        {mostFavoriteType ? (
          <MeetingSection
            title="추천 모임"
            moreHref="/meetings/list"
            endpoint={`/meetings?size=4&type=${encodeURIComponent(mostFavoriteType)}`}
            icon={<Sparkles className="h-5 w-5 text-violet-500" />}
          />
        ) : (
          <section className="mt-10">
            <div className="px-6">
              <SectionHeader
                title="추천 모임"
                icon={<Sparkles className="h-5 w-5 text-violet-500" />}
              />
            </div>

            <div className="px-8 md:px-6">
              {hasRecommendationError ? (
                <RecommendationError />
              ) : (
                <EmptyState
                  title="추천 모임이 없습니다"
                  description="관심 있는 모임을 찜하면 취향에 맞는 모임을 추천해 드려요!"
                  href="/meetings/list"
                  linkText="모임 찾으러 가기"
                />
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
