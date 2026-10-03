"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { LikeButton } from "@/components/ui/IconButton/LikeButton";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { Share2 } from "lucide-react";
import Tags from "@/components/ui/Tags/Tags";
import Kebab from "@/components/ui/Kebab/Kebab";
import {
  LoginRequiredModal,
  EditMeetingModal,
  DeleteMeetingModal,
} from "@/features/meetingDetail/ui/Modal";
import { showToast } from "@/components/ui/Sonner";
import formatRegistrationEnd from "@/lib/convertDate/formatRegistrationEnd";
import { MeetingDetailInfoCardProps } from "@/features/meetingDetail/types/meetingDetail";
import {
  useJoinMeetingMutation,
  useCancelMeetingMutation,
  useChangeMeetingStatusMutation,
} from "@/features/meetingDetail/hooks/useMeetingMutations";

const InfoCard = ({
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
  confirmedAt,
  canceledAt,
}: MeetingDetailInfoCardProps) => {
  // TODO: 인증 구현 후에는 isLoggedIn props를 제거하고 실제 인증 상태를 가져오는 구조로 변경
  // const { isLoggedIn } = useAuth(); <- 로그인 정보를 전역 상태로 관리하는 경우 useAuth hook 사용

  // TODO: 찜하기 TanStack Query 사용 -> useState 삭제 후 Query와 mutation으로 관리
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isParticipating = initialIsParticipating;

  const isFull = participantCount >= capacity;
  const { isClosed } = formatRegistrationEnd(registrationEnd);
  const isConfirmed = confirmedAt !== null;
  const isCanceled = canceledAt !== null;

  const joinMutation = useJoinMeetingMutation(id);
  const cancelMutation = useCancelMeetingMutation(id);
  const changeStatusMutation = useChangeMeetingStatusMutation(id);
  const isParticipationLoading =
    joinMutation.isPending || cancelMutation.isPending;

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
    } catch {
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

    if (isParticipationLoading) return;

    if (isParticipating) {
      cancelMutation.mutate();
    } else {
      joinMutation.mutate();
    }
  };

  // 모임 공유하기
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      showToast({
        kind: "success",
        message: "모임 링크가 복사되었습니다.",
      });
    } catch {
      showToast({
        kind: "error",
        message: "모임 링크 복사에 실패했습니다.",
      });
    }
  };

  // 모임 확정하기
  const handleConfirmMeeting = () => {
    changeStatusMutation.mutate("CONFIRMED");
  };

  // // 모임 취소하기
  // const handleCancelMeeting = () => {
  //   changeStatusMutation.mutate("CANCELED");
  // };

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
                    setIsEditModalOpen(true);
                  }}
                  onDelete={() => {
                    setIsDeleteModalOpen(true);
                  }}
                />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-lg font-semibold text-[#1F2937] lg:text-[28px]">
                <span className="min-w-0 text-wrap">{title}</span>

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

          <section className="flex items-center w-full shrink-0 gap-2">
            <div>
              <LikeButton
                isLiked={isFavorited}
                onToggle={handleLikeToggle}
                size="md"
              />
            </div>

            {isOwner ? (
              <div className="flex items-center w-full gap-3">
                <div className="flex-1 items-center">
                  <IconButton aria-label="공유하기" onClick={handleShare}>
                    <Share2 className="w-12 h-12 text-neutral-600" />
                  </IconButton>
                </div>

                <Button
                  size="lg"
                  variant="primary"
                  aria-label={
                    isConfirmed ? "확정된 모임입니다" : "모임 확정하기"
                  }
                  fullWidth
                  disabled={isConfirmed || isCanceled}
                  // TODO: 정원 미달이어도 주최자가 수동으로 확정가능하지 않다면 아래 코드
                  // disabled={isConfirmed || isCanceled || !isFull}
                  isLoading={changeStatusMutation.isPending}
                  onClick={handleConfirmMeeting}
                >
                  {isConfirmed ? "확정된 모임입니다" : "모임 확정하기"}
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                variant="primary"
                aria-label={isParticipating ? "참여 취소하기" : "참여하기"}
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

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <DeleteMeetingModal
        meetingId={id}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <EditMeetingModal
        meetingId={id}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};

export default InfoCard;
