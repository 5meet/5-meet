"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import Label from "@/components/ui/Form/label/Label";
import Input from "@/components/ui/Form/input/Input";
import { InputDropdown } from "@/components/ui/Dropdown/InputDropdown";
import { AddressSearchField } from "@/components/ui/Form/input/AddressSearchField";
import { MEETING_TYPE_OPTIONS } from "@/lib/constants/meetingType";
import { useUpdateMeetingMutation } from "@/features/meetingDetail/hooks/useMeetingMutations";
import { ImageUploadField } from "@/components/ui/Form/input/ImageUploadField";
import TextArea from "@/components/ui/Form/input/Textarea";
import { DateField } from "@/components/ui/Form/input/DateField";
import { TimeField } from "@/components/ui/Form/input/TimeField";

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

  const [value, setValue] = useState<string | null>(editMutation.type);

  return (
    <Modal isOpen={isOpen}>
      <Modal.Header onClose={onClose}>
        <Modal.Title>
          <h3 className="text-base font-semibold md:text-xl">모임 수정하기</h3>
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
              <div className="flex flex-col gap-4 mt-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="meeting-type" required>
                    모임 종류
                  </Label>
                  <InputDropdown
                    options={MEETING_TYPE_OPTIONS}
                    value={value}
                    placeholder="모임 종류를 선택하세요"
                    onChange={setValue}
                    disabled={false}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="meeting-name" required>
                    모임 이름
                  </Label>
                  <Input
                    id="meeting-name"
                    type="text"
                    placeholder="모임 이름을 입력하세요"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <AddressSearchField
                  // address={address}
                  // detailAddress={detailAddress}
                  // onSelectAddress={(result) => {
                  //   setAddress(result.address);
                  //   args.onSelectAddress(result);
                  // }}
                  // onDetailAddressChange={(value) => {
                  //   setDetailAddress(value);
                  //   args.onDetailAddressChange(value);
                  // }}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="meeting-image" required>
                    이미지
                  </Label>
                  <ImageUploadField
                  // value={value}
                  // onFileSelect={(file) => {
                  //   const previewUrl = URL.createObjectURL(file);

                  //   setValue(previewUrl);
                  //   args.onFileSelect(file);
                  // }}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="meeting-description" required>
                    모임 설명
                  </Label>
                  <TextArea required />
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="flex flex-col gap-4 mt-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="meeting-dateTime" required>
                    모임 일정
                  </Label>
                  <div className="flex gap-3">
                    <DateField
                    // value={value}
                    // onChange={(date) => {
                    //   setValue(date);
                    //   args.onChange(date);
                    // }}
                    />
                    <TimeField
                    // value={value}
                    // onChange={(time) => {
                    //   setValue(time);
                    //   args.onChange(time);
                    // }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="meeting-registrationEnd" required>
                    모임 마감 날짜
                  </Label>
                  <div className="flex gap-3">
                    <DateField
                    // value={value}
                    // onChange={(date) => {
                    //   setValue(date);
                    //   args.onChange(date);
                    // }}
                    />
                    <TimeField
                    // value={value}
                    // onChange={(time) => {
                    //   setValue(time);
                    //   args.onChange(time);
                    // }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="meeting-capacity" required>
                    모임 정원
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={0}
                    placeholder="모임 정원을 입력해주세요"
                    required
                  />
                </div>
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
