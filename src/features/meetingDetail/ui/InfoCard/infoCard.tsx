"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";
import Tags from "@/components/ui/Tags/Tags";
import Kebab from "@/components/ui/Kebab/Kebab";
import { Modal } from "@/components/ui/Modal/Modal";
import { showToast } from "@/components/ui/Sonner";
import formatRegistrationEnd from "@/lib/convertDate/formatRegistrationEnd";
import { MeetingDetailInfoCardProps } from "@/features/meetingDetail/types/meetingDetail";

// 인증 구현 후에는 isLoggedIn props를 제거하고 실제 인증 상태를 가져오는 구조로 변경

const MeetingDetailInfoCard = ({
  id,
  title,
  location,
  category,
  date,
  time,
  registrationEnd,
  isOwner,
  initialIsParticipating,
  participantCount,
  capacity,
  initialIsFavorited,
  isLoggedIn,
}: MeetingDetailInfoCardProps) => {
  // 인증 구현 후에는 isLoggedIn props를 제거하고 실제 인증 상태를 가져오는 구조로 변경
  // const { isLoggedIn } = useAuth(); <- 로그인 정보를 전역 상태로 관리하는 경우 useAuth hook 사용

  //IF : TanStack Query 사용 -> useState 삭제 후 Query와 mutation으로 관리
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isParticipating, setIsParticipating] = useState(
    initialIsParticipating,
  );
  const [isParticipationLoading, setIsParticipationLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isFull = participantCount >= capacity;
  const { isClosed } = formatRegistrationEnd(registrationEnd);

  // 찜하기
  const handleLikeToggle = async () => {
    try {
      // TODO: const result = await toggleLike(meetingId);

      setIsFavorited((prev) => !prev);

      // TODO: API 연결 후 result.isFavorited으로 변경
      showToast({
        kind: "success",
        message: isFavorited
          ? "찜 목록에서 삭제되었습니다."
          : "찜 목록에 추가되었습니다.",
      });
    } catch (error) {
      console.error("찜 상태 변경에 실패했습니다.", error);

      showToast({
        kind: "error",
        message: "찜 상태 변경에 실패했습니다.",
      });
    }
  };

  // 참여하기 <-> 참여 취소하기
  const handleParticipation = async () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isParticipationLoading) {
      return;
    }

    setIsParticipationLoading(true);

    try {
      if (isParticipating) {
        // TODO: await cancelParticipation(meetingId);

        setIsParticipating(false);

        showToast({
          kind: "success",
          message: "참여가 취소되었습니다.",
        });
      } else {
        // TODO: await participateMeeting(meetingId);

        setIsParticipating(true);

        showToast({
          kind: "success",
          message: "모임 참여가 완료되었습니다.",
        });
      }
    } catch (error) {
      console.error("참여 상태 변경에 실패했습니다.", error);

      showToast({
        kind: "error",
        message: "참여 상태 변경에 실패했습니다.",
      });
    } finally {
      setIsParticipationLoading(false);
    }
  };

  // 공유하기
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      showToast({
        kind: "success",
        message: "모임 링크가 복사되었습니다.",
      });
    } catch (error) {
      console.error("URL 복사에 실패했습니다.", error);

      showToast({
        kind: "error",
        message: "모임 링크 복사에 실패했습니다.",
      });
    }
  };

  return (
    <>
      <section className="flex w-85.75 min-h-50 px-6 py-6 bg-white rounded-3xl shadow-sm lg:w-157.5 lg:min-h-70.5 lg:px-10 lg:py-8">
        <div className="flex flex-col w-full gap-5 lg:gap-8">
          <section className="flex flex-col w-full gap-4 lg:gap-5">
            <div className="flex justify-between">
              <Tags date={date} time={time} registrationEnd={registrationEnd} />

              {isOwner && (
                <Kebab
                  onEdit={() => {
                    // TODO: 모임 수정
                  }}
                  onDelete={() => {
                    // TODO: 모임 삭제
                  }}
                />
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-lg font-semibold text-[#1F2937] lg:text-[28px]">
                <span className="min-w-0 break-words">{title}</span>

                {isOwner && (
                  <Image
                    src="/ic_crown.svg"
                    alt="주최자"
                    width={32}
                    height={32}
                  />
                )}
              </div>

              <div className="flex gap-0.5 text-sm font-medium text-gray-600 lg:text-base">
                <Image src="/ic_location.svg" alt="" width={16} height={16} />
                <span>{location}</span>
                <span>·</span>
                <span>{category}</span>
              </div>
            </div>
          </section>

          <section className="flex w-full shrink-0 gap-4">
            <LikeButton
              isLiked={isFavorited}
              onToggle={handleLikeToggle}
              size="lg"
            />

            {/* TODO: isLoading - 추후 API 연결 및 공유 기능 구현 후 수정 */}
            {isOwner ? (
              <Button
                size="lg"
                variant="primary"
                fullWidth
                onClick={handleShare}
              >
                공유하기
              </Button>
            ) : (
              <Button
                size="lg"
                variant={isParticipating ? "secondary" : "primary"}
                fullWidth
                disabled={!isParticipating && (isFull || isClosed)}
                onClick={handleParticipation}
              >
                {isParticipating ? "참여 취소하기" : "참여하기"}
              </Button>
            )}
          </section>
        </div>
      </section>

      <Modal isOpen={isLoginModalOpen}>
        <Modal.Header onClose={() => setIsLoginModalOpen(false)} />
        <Modal.Body>
          <div className="text-center font-bold text-lg">
            로그인이 필요한 서비스입니다.
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setIsLoginModalOpen(false)}
            size="sm"
          >
            취소
          </Button>

          <Button
            className="flex-1"
            onClick={() => {
              // TODO: 로그인 페이지 이동

              setIsLoginModalOpen(false);
            }}
            size="sm"
          >
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MeetingDetailInfoCard;
