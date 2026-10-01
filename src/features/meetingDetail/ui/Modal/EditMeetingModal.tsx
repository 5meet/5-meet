"use client";

import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { useUpdateMeetingMutation } from "@/features/meetingDetail/hooks/useMeetingMutations";

interface EditMeetingModalProps {
  meetingId: number;
  isOpen: boolean;
  onClose: () => void;
}

const EditMeetingModal = ({
  meetingId,
  isOpen,
  onClose,
}: EditMeetingModalProps) => {
  const editMutation = useUpdateMeetingMutation(meetingId);

  return (
    <Modal isOpen={isOpen}>
      <Modal.Header onClose={onClose}>
        <Modal.Title>모임 수정하기</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="font-medium text-sm text-gray-800">
          {/* 수정 body */}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          className="flex-1"
          size="sm"
          onClick={onClose}
        >
          취소
        </Button>
        <Button
          className="flex-1"
          size="sm"
          isLoading={editMutation.isPending}
          onClick={() => editMutation.mutate()}
        >
          수정하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditMeetingModal;
