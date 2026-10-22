import { cookies } from "next/headers";
import Link from "next/link";
import { HeroBanner } from "./HeroBanner";
import { SearchSection } from "./search/SearchSection";
import { Flame, Sparkles } from "lucide-react";

import { MeetingSection } from "./meeting/MeetingSection";
import { serverFetch } from "@/lib/api/serverFetch";
import { ApiError } from "@/lib/api/ApiError";

import type { GetFavoritesResponse } from "@/features/favorites/types";
import { getMostFavoriteType } from "@/lib/utils/getMostFavoriteType";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";

export async function MeetingsContent() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  let mostFavoriteType: string | null = null;

  if (accessToken) {
    try {
      const favoriteList = await serverFetch<GetFavoritesResponse>(
        "/favorites",
        {
          auth: true,
        },
      );
      mostFavoriteType = getMostFavoriteType(favoriteList.data);
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        throw error;
      }
    }
  }

  console.log("찜 목록:", mostFavoriteType);

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
          endpoint="/meetings?sortBy=participantCount&sortOrder=desc"
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
              <EmptyState
                title="추천 모임이 없습니다"
                description="관심 있는 모임을 찜하면 취향에 맞는 모임을 추천해 드려요!"
                href="/meetings/list"
                linkText="모임 찾으러 가기"
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
