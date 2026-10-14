import { Suspense } from "react";

import { MeetingCardList } from "./MeetingCardList";
import { MeetingCardListSkeleton } from "./MeetingCardListSkeleton";
import { SearchSection } from "../search/SearchSection";

interface MeetingsFindContentProps {
  keyword?: string;
}

export default function MeetingsFindContent({
  keyword,
}: MeetingsFindContentProps) {
  const endpoint = keyword
    ? `/meetings?keyword=${encodeURIComponent(keyword)}`
    : "/meetings?size=20";

  return (
    <main className="mx-auto w-full md:w-[90%]">
      <section className="px-4 py-6 md:px-6">
        <h1 className="text-2xl font-bold">모임 찾기</h1>
        <div className="mt-4">
          <SearchSection />
        </div>

        {keyword && (
          <p className="mt-2 text-gray-500">&quot;{keyword}&quot; 검색 결과</p>
        )}
      </section>

      <Suspense key={endpoint} fallback={<MeetingCardListSkeleton />}>
        <MeetingCardList endpoint={endpoint} />
      </Suspense>
    </main>
  );
}
