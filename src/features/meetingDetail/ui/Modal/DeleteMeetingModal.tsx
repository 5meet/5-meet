"use client";

import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { useDeleteMeetingMutation } from "@/features/meetingDetail/hooks/useMeetingMutations";

interface DeleteMeetingModalProps {
  meetingId: number;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteMeetingModal = ({
  meetingId,
  isOpen,
  onClose,
}: DeleteMeetingModalProps) => {
  const deleteMutation = useDeleteMeetingMutation(meetingId);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header onClose={onClose} />

      <Modal.Body>
        <div className="flex flex-col gap-3 text-center font-semibold text-lg text-gray-800 md:text-2xl">
          <span>모임을 정말 삭제하시겠어요?</span>
          <span className="font-normal text-sm text-gray-500 md:font-medium md:text-lg">
            삭제 후에는 되돌릴 수 없습니다.
          </span>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          aria-label="취소"
          variant="secondary"
          className="flex-1"
          size="sm"
          onClick={onClose}
        >
          취소
        </Button>
        <Button
          aria-label="확인"
          className="flex-1"
          size="sm"
          isLoading={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate()}
        >
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteMeetingModal;
