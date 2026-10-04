import { serverFetch } from "@/lib/api/serverFetch";
import { HeroBanner } from "./HeroBanner";
import { SearchSection } from "./search/SearchSection";
import { SectionHeader } from "./SectionHeader";
import { Flame, UserPlus } from "lucide-react";
import { MeetingsResponse } from "../types/meeting";
import { MeetingCardList } from "./MeetingCardList";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton/FloatingActionButton";

export async function MeetingsContent() {
  const response = await serverFetch<MeetingsResponse>(
    "/meetings?sortBy=participantCount&sortOrder=desc",
  );

  const popularMeetings = response.data.slice(0, 4);
  return (
    <main className="md:mt-4">
      <div className="mx-auto w-full md:w-[90%] md:max-w-360">
        <HeroBanner />

        <div className="relative z-10 -mt-6 px-4 md:px-14">
          <SearchSection />
        </div>

        <section className="mt-10">
          <div className="px-6">
            <SectionHeader
              title="지금 인기 있는 모임"
              moreHref="/meetings?sortBy=participantCount&sortOrder=desc"
              icon={<Flame className="h-5 w-5 text-orange-500" />}
            />
          </div>

          <MeetingCardList meetings={popularMeetings} />
        </section>

        <section className="mt-10">
          <div className="px-6">
            <SectionHeader
              title="추천 모임"
              moreHref="/meetings?sortBy=participantCount&sortOrder=desc"
            />
          </div>

          <MeetingCardList meetings={popularMeetings} />
        </section>
      </div>
      {/* <div className="fixed right-4 bottom-25 z-50 md:right-8 md:bottom-8">
        <FloatingActionButton icon={UserPlus} label="모임 만들기" />
      </div> */}
    </main>
  );
}
