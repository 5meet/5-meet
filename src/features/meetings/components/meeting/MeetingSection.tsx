// meetings페이지의 인기 모임, 추천 모임 공통 section

import { SectionHeader } from "../SectionHeader";
import { MeetingCardList } from "./MeetingCardList";
import { MeetingsResponse } from "../../types/meeting";
import { ReactNode, Suspense } from "react";
import { serverFetch } from "@/lib/api/serverFetch";
import { EmptyState } from "../EmptyState";
import { MeetingCardListSkeleton } from "./MeetingCardListSkeleton";

interface MeetingSectionProps {
  title: string;
  moreHref: string;
  endpoint: string;
  icon?: ReactNode;
}

export function MeetingSection({
  title,
  moreHref,
  endpoint,
  icon,
}: MeetingSectionProps) {
  return (
    <section className="mt-10">
      <div className="px-6">
        <SectionHeader
          title={title}
          moreHref={moreHref}
          icon={icon}
        />
      </div>

      <Suspense fallback={<MeetingCardListSkeleton />}>
        <MeetingCardList endpoint={endpoint} />
      </Suspense>
    </section>
  );
}