"use client";

import { useRef } from "react";
import Image from "next/image";
import InfoCard from "@/features/meetingDetail/ui/InfoCard";
import { PersonnelCard } from "@/features/meetingDetail/ui/PersonnelCard";
import KakaoMap from "@/features/meetingDetail/ui/KakaoMap";
import { ReviewCardList } from "@/features/meetingDetail/ui/ReviewCard";
import Pagination from "@/components/ui/Pagination/Pagination";
import CompactCard from "@/components/ui/CompactCard/CompactCard";
import { showToast } from "@/components/ui/Sonner";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useMeetingDetailQuery } from "@/features/meetingDetail/hooks/useMeetingDetailQuery";
import { useParticipantsQuery } from "@/features/meetingDetail/hooks/useParticipantsQuery";
import { useReviewsPagination } from "@/features/meetingDetail/hooks/useReviewsPagination";
import { useRecommendedMeetingsQuery } from "@/features/meetingDetail/hooks/useRecommendedMeetingsQuery";

interface MeetingDetailPageClientProps {
  meetingId: number;
  isLoggedIn: boolean;
  currentUserId: number | null;
}

const MeetingDetailPageClient = ({
  meetingId,
  isLoggedIn,
  currentUserId,
}: MeetingDetailPageClientProps) => {
  const {
    data: meeting,
    isLoading,
    isError,
    error,
  } = useMeetingDetailQuery(meetingId);
  const { data: participantsData } = useParticipantsQuery(meetingId);
  const { reviews, currentPage, totalPages, onPageChange } =
    useReviewsPagination(meetingId);
  const { data: recommended } = useRecommendedMeetingsQuery(meeting);

  // 주소 복사하기
  const handleShare = async () => {
    if (!meeting) return;
    try {
      await navigator.clipboard.writeText(meeting.address);

      showToast({
        kind: "success",
        message: "주소가 복사되었습니다.",
      });
    } catch {
      showToast({
        kind: "error",
        message: "주소 복사에 실패했습니다.",
      });
    }
  };

  // // 리뷰 페이지네이션 시, 리뷰 섹션으로 스크롤 이동
  // const reviewSectionRef = useRef<HTMLElement>(null);
  // const handleReviewPageChange = (page: number) => {
  //   onPageChange(page);
  //   reviewSectionRef.current?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  if (isLoading || !meeting) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-20 text-gray-500">
        <Spinner size="lg" className="text-primary-500" />
        <span className="text-sm">불러오는 중...</span>
      </div>
    );
  }

  if (isError) {
    console.error("모임 상세 조회 실패:", error);

    return (
      <div className="flex items-center justify-center p-20 text-gray-500">
        <span className="text-sm">모임 정보를 불러오지 못했습니다.</span>
      </div>
    );
  }

  // if (!meeting) {
  //   return <MeetingNotFound />;
  // }

  // isOwner는 API 응답이 아니라, 로그인한 사용자와 hostId를 비교해 클라이언트가 계산
  const isOwner =
    isLoggedIn && currentUserId !== null && meeting.hostId === currentUserId;

  return (
    <main className="flex flex-col items-center mx-auto mt-20 mb-10 px-5 md:mb-20 lg:mb-40 md:mt-30">
      <div className="flex flex-col w-full max-w-[343px] gap-20 font-semibold text-black text-base md:text-xl lg:text-2xl md:max-w-174 lg:max-w-7xl">
        {/* 모임 information */}
        <section className="w-full">
          <div className="flex gap-4 justify-center flex-wrap md:flex-nowrap">
            <div className="relative w-[343px] h-[241px] bg-[#EDEDED] rounded-4xl shadow-sm overflow-hidden md:w-[333px] md:h-[362px] lg:w-[630px] lg:h-[443px]">
              {meeting.image && (
                <Image
                  src={meeting.image}
                  alt={meeting.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex flex-col gap-4">
              <InfoCard
                id={meeting.id}
                title={meeting.title}
                location={meeting.location}
                category={meeting.category}
                date={meeting.date}
                time={meeting.time}
                registrationEnd={meeting.registrationEnd}
                isOwner={isOwner}
                initialIsParticipating={meeting.initialIsParticipating}
                participantCount={meeting.participantCount}
                capacity={meeting.capacity}
                initialIsFavorited={meeting.initialIsFavorited}
                isLoggedIn={isLoggedIn}
                confirmedAt={meeting.confirmedAt}
                canceledAt={meeting.canceledAt}
              />

              <PersonnelCard
                participantCount={meeting.participantCount}
                capacity={meeting.capacity}
                participants={participantsData?.data ?? []}
              />
            </div>
          </div>
        </section>

        {meeting.description && (
          <section className="flex flex-col gap-4 w-full">
            <h3>모임 설명</h3>

            <div className="flex flex-col gap-2.5 w-full rounded-3xl shadow-sm px-5 py-4 md:px-12 md:py-6">
              <div className="flex gap-1.5 font-normal text-xs text-gray-500 md:text-sm">
                <div className="flex gap-1.5">
                  <Image
                    src={meeting.host.image ?? "/profile/profile_female1.svg"}
                    alt={`${meeting.host.name} 프로필`}
                    width={24}
                    height={24}
                    className="object-cover"
                  />

                  <span>{meeting.host.name}</span>
                </div>

                <span>{meeting.createdAt}</span>
              </div>

              <span className="text-wrap wrap-break-word font-normal text-lg text-[#374151]">
                {meeting.description}
              </span>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-4 w-full">
          <h3>모임 장소</h3>

          <div className="flex flex-col w-full h-65 rounded-4xl md:h-88">
            <div className="flex w-full h-full rounded-t-4xl overflow-hidden border border-b-0 border-gray-400">
              <KakaoMap
                latitude={meeting.latitude}
                longitude={meeting.longitude}
                address={meeting.address}
              />
            </div>

            <div className="flex items-center gap-2.5 w-full rounded-b-4xl border border-t-0 border-gray-400 px-8 py-5.5 overflow-hidden">
              <span className="font-medium text-xs md:text-lg text-black">
                {meeting.address}
              </span>
              <button
                className="flex gap-0.5 items-center font-medium text-xs md:text-lg text-primary-600"
                onClick={handleShare}
              >
                <Image src="/ic_copy.svg" alt="복사" width={18} height={18} />
                복사
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 w-full">
          <h3>리뷰 모아보기</h3>
          <ReviewCardList reviews={reviews} />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              scrollToTop={false}
            />
          )}
        </section>

        {!isOwner && recommended && recommended.length > 0 && (
          <section className="flex flex-col gap-4 w-full">
            <h3>이런 모임은 어때요?</h3>
            <div
              className="flex gap-4 overflow-x-auto scrollbar-hidden snap-x snap-mandatory max-w-[664px] md:max-w-[1256px]"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {recommended.map((r) => (
                <div key={r.id} className="snap-start shrink-0">
                  <CompactCard
                    variant="meeting"
                    id={r.id}
                    title={r.title}
                    image={r.image}
                    location={r.location}
                    category={r.category}
                    date={r.date}
                    time={r.time}
                    registrationEnd={r.registrationEnd}
                    initialIsFavorited={r.initialIsFavorited}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default MeetingDetailPageClient;
