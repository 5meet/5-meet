"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import { useUpdateMeetingMutation } from "@/features/meetingDetail/hooks/useMeetingMutations";

interface EditMeetingModalProps {
  meetingId: number;
  isOpen: boolean;
  onClose: () => void;
}

// Tabs 라벨
const EDIT_TABS = [
  { label: "기본 정보", value: "basic" },
  { label: "일정 및 인원", value: "schedule" },
] as const;

type EditTabValue = (typeof EDIT_TABS)[number]["value"];

const EditMeetingModal = ({
  meetingId,
  isOpen,
  onClose,
}: EditMeetingModalProps) => {
  const editMutation = useUpdateMeetingMutation(meetingId);
  const [activeTab, setActiveTab] = useState<EditTabValue>("basic");

  return (
    <Modal isOpen={isOpen}>
      <Modal.Header onClose={onClose}>
        <Modal.Title>
          <div>
            <h3 className="text-base font-semibold md:text-xl">
              모임 수정하기
            </h3>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <Tabs
            tabs={[...EDIT_TABS]}
            activeTab={activeTab}
            onChange={(value) => setActiveTab(value as EditTabValue)}
          />
          <div className="font-medium text-sm text-gray-800">
            {activeTab === "basic" && (
              <div className="flex flex-col gap-4">
                {/* InputDropdown(모임 종류), Input(모임 이름), AddressSearchField, ImageUploadField */}
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="flex flex-col gap-4">
                {/* DateField+TimeField(모임 일정), DateField+TimeField(마감), Input(정원) */}
              </div>
            )}
          </div>
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
