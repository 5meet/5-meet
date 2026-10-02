import { HeroBanner } from "./HeroBanner";
import { SearchSection } from "./search/SearchSection";
import { Flame, UserPlus, Sparkles  } from "lucide-react";

import { FloatingActionButton } from "@/components/ui/FloatingActionButton/FloatingActionButton";
import { MeetingSection } from "./meeting/MeetingSection";

export async function MeetingsContent() {
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
          endpoint="/meetings"
          icon={<Flame className="h-5 w-5 text-orange-500" />}
        />

        <MeetingSection
          title="추천 모임"
          moreHref="/meetings/list"
          endpoint="/meetings"
          icon={<Sparkles className="h-5 w-5 text-violet-500" />}
        />
      </div>
      <div className="fixed right-4 bottom-25 z-50 md:right-8 md:bottom-8">
        <FloatingActionButton icon={UserPlus} label="모임 만들기" />
      </div>
    </main>
  );
}
