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
  // const {
  //   data: meeting,
  //   isLoading,
  //   isError,
  //   error,
  // } = useMeetingDetailQuery(meetingId);
  const meeting = {
    id: 1,
    title: "작은 독서 습관 만들기",
    location: "건대입구",
    category: "달램핏",
    date: "2월 15일",
    time: "17:30",
    registrationEnd: "2027-02-09T23:59:59.000Z",
    capacity: 10,
    participantCount: 5,
    image: "/sample.jpg",
    description:
      "작은 독서 습관을 만들기위해서 같이 열심히 해보실 사람을 구합니다~ 궁금한 점 있으시면 https://open.kakao.com/o/abcdefg12345 참여해서 질문주세요~ 작은 독서 습관을 만들기위해서 같이 열심히 해보실 사람을 구합니다~ 궁금한 점 있으시면 https://open.kakao.com/o/abcdefg12345 참여해서 질문주세요~ 작은 독서 습관을 만들기위해서 같이 열심히 해보실 사람을 구합니다~ 궁금한 점 있으시면 https://open.kakao.com/o/abcdefg12345 참여해서 질문주세요~ 작은 독서 습관을 만들기위해서 같이 열심히 해보실 사람을 구합니다~ 궁금한 점 있으시면 https://open.kakao.com/o/abcdefg12345 참여해서 질문주세요~",
    address: "서울시 광진구 자양동 123-45",
    latitude: 37.5407,
    longitude: 127.0693,
    createdAt: "2026-02-01T10:00:00.000Z",
    hostId: 1,
    host: { id: 1, name: "홍길동", image: null },
    initialIsFavorited: false,
    initialIsParticipating: false,
    isCompleted: false,
    canceledAt: null,
    confirmedAt: null,
    dateTime: "2027-02-10T14:00:00.000Z",
  };
  const isLoading = false;
  const isError = false;
  const error = null;

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
  const isOwner = isLoggedIn && meeting.hostId === TEMP_CURRENT_USER_ID;

  return (
    <main className="flex flex-col max-w-[1920px] justify-center items-center gap-20 mx-auto mt-20 mb-10 font-semibold text-black text-base md:text-xl lg:text-2xl md:mb-20 lg:mb-40 md:mt-30">
      {/* 모임 information */}
      <section className="flex">
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
            />

            <PersonnelCard
              participantCount={meeting.participantCount}
              capacity={meeting.capacity}
              participants={participantsData?.data ?? []}
            />
          </div>
        </div>
      </section>

      {!isOwner && meeting.description && (
        <section className="flex flex-col gap-4 justify-center md:w-full">
          <h3>모임 설명</h3>

          <div className="flex flex-col gap-2.5 w-85.75 rounded-3xl shadow-sm px-5 py-4 md:px-12 md:py-6 md:w-full md:max-w-[696px] lg:max-w-[1280px]">
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

      <section className="flex flex-col gap-4 justify-center md:w-full">
        <h3>모임 장소</h3>

        <div className="flex flex-col w-85.75 h-65 rounded-4xl md:h-88 md:w-full">
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

      <section className="flex flex-col gap-4 justify-center md:w-full">
        <h3>리뷰 모아보기</h3>
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
        <section className="flex flex-col gap-4 justify-center md:w-full">
          <h3>이런 모임은 어때요?</h3>
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
    </main>
  );
};

export default MeetingDetailPageClient;
