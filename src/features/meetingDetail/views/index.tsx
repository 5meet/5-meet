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

// TODO: 인증 구현 전까지 쓰는 임시값. 실제 로그인 사용자 id로 교체 필요
const TEMP_CURRENT_USER_ID = 1;

interface MeetingDetailPageClientProps {
  meetingId: number;
  isLoggedIn: boolean;
}

const MeetingDetailPageClient = ({
  meetingId,
  isLoggedIn,
}: MeetingDetailPageClientProps) => {
  const { data: meeting, isLoading } = useMeetingDetailQuery(meetingId);
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

  if (isLoading || !meeting) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-20 text-gray-500">
        <Spinner size="lg" className="text-primary-500" />
        <span className="text-sm">불러오는 중...</span>
      </div>
    );
  }

  // isOwner는 API 응답이 아니라, 로그인한 사용자와 hostId를 비교해 클라이언트가 계산
  const isOwner = isLoggedIn && meeting.hostId === TEMP_CURRENT_USER_ID;

  // 사용자가 주최자가 아니라 참여자일 경우,
  // -> 모임 상세 페이지에서 모임 설명, 모임 장소, 리뷰 모아보기, 이런 모임은 어때요? 섹션을 보여줍니다.
  // 사용자가 주최자일 경우,
  // -> 모임 상세 페이지에서 모임 장소, 리뷰 모아보기, 섹션을 보여줍니다.
  //    + 모임 수정, 모임 삭제 버튼을 보여줍니다.
  //    + 모임 수정 버튼 클릭 시, 모임 수정 모달이 열립니다.
  //    + 모임 삭제 버튼 클릭 시, 모임 삭제 확인 모달이 열립니다.
  return (
    <>
      <div className="flex flex-col gap-8 w-[343px] font-semibold text-black text-base md:text-xl lg:text-2xl md:w-174 lg:w-7xl">
        <section className="flex gap-2 w-full md:gap-4">
          <div className="w-[343px] h-[241px] rounded-4xl shadow-md overflow-hidden md:w-[333px] md:h-[332px] lg:w-[630px] lg:h-[443px]">
            {meeting.image}
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
            />

            <PersonnelCard
              participantCount={meeting.participantCount}
              capacity={meeting.capacity}
              participants={participantsData.data}
            />
          </div>
        </section>

        {!isOwner && meeting.description && (
          <section className="flex flex-col gap-5 w-full">
            <div>모임 설명</div>

            <div className="flex gap-2.5 w-full min-h-57.5 max-h-88 rounded-4xl px-5 py-4 md:px-12 md:py-6">
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

              {meeting.description}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-5 w-full">
          <div>모임 장소</div>

          <div className="flex gap-2.5 w-full h-65 rounded-4xl px-5 py-4 md:h-88 md:px-12 md:py-6">
            <KakaoMap
              latitude={meeting.latitude}
              longitude={meeting.longitude}
              address={meeting.address}
            />

            <div className="flex gap-2.5 w-full border border-t-0 border-gray-400 px-8 py-5.5">
              {meeting.address}
              <button
                className="flex gap-0.5 items-center font-medium text-lg text-primary-600"
                onClick={handleShare}
              >
                <Image src="/ic_copy.svg" alt="복사" width={18} height={18} />
                복사
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5 w-full">
          <div>리뷰 모아보기</div>
          <ReviewCardList reviews={reviews} />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </section>

        {!isOwner && recommended && recommended.length > 0 && (
          <section className="flex flex-col gap-5 w-full">
            <div>이런 모임은 어때요?</div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hidden">
              {recommended.map((r) => (
                <CompactCard
                  key={r.id}
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
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default MeetingDetailPageClient;
