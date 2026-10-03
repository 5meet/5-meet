"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import Label from "@/components/ui/Form/label/Label";
import Input from "@/components/ui/Form/input/Input";
import { InputDropdown } from "@/components/ui/Dropdown/InputDropdown";
import { AddressSearchField } from "@/components/ui/Form/input/AddressSearchField";
import { ImageUploadField } from "@/components/ui/Form/input/ImageUploadField";
import { DateField } from "@/components/ui/Form/input/DateField";
import { TimeField } from "@/components/ui/Form/input/TimeField";
import TextArea from "@/components/ui/Form/input/Textarea";

import { MEETING_TYPE_OPTIONS } from "@/lib/constants/meetingType";
import { MeetingUpdateRequest } from "@/features/meetingDetail/types/meetingDetail";
import { useUpdateMeetingMutation } from "@/features/meetingDetail/hooks/useMeetingMutations";
import { useMeetingDetailQuery } from "@/features/meetingDetail/hooks/useMeetingDetailQuery";

import {
  splitISOToKSTDateTime,
  combineKSTDateTimeToISO,
} from "@/lib/convertDate/formatMeetingDate";

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

// 폼 내부에서 쓰는 상태
interface EditMeetingFormState {
  name: string;
  type: string;
  region: string; // 도로명 주소 (AddressSearchField의 address)
  address: string; // 상세 주소
  latitude: number;
  longitude: number;
  date: string; // "2027-02-10"
  time: string; // "17:30"
  registrationEndDate: string;
  registrationEndTime: string;
  capacity: number;
  image: string; // 미리보기/업로드된 URL
  description: string;
}

const INITIAL_FORM: EditMeetingFormState = {
  name: "",
  type: "",
  region: "",
  address: "",
  latitude: 0,
  longitude: 0,
  date: "",
  time: "",
  registrationEndDate: "",
  registrationEndTime: "",
  capacity: 0,
  image: "",
  description: "",
};

const EditMeetingModal = ({
  meetingId,
  isOpen,
  onClose,
}: EditMeetingModalProps) => {
  const { data: meeting } = useMeetingDetailQuery(meetingId);
  const editMutation = useUpdateMeetingMutation(meetingId);

  const [activeTab, setActiveTab] = useState<EditTabValue>("basic");
  const [form, setForm] = useState<EditMeetingFormState>(INITIAL_FORM);
  const [initializedMeetingId, setInitializedMeetingId] = useState<
    number | null
  >(null);

  // 서버 데이터가 도착하면 이 모임에 대해 아직 초기화하지 않았을 때만 폼 채우기
  // 렌더 중 처리: useEffect 대신 불필요한 리렌더 사이클을 줄이기
  if (meeting && initializedMeetingId !== meeting.id) {
    const { date, time } = splitISOToKSTDateTime(meeting.dateTime);
    const { date: regDate, time: regTime } = splitISOToKSTDateTime(
      meeting.registrationEnd,
    );

    setForm({
      name: meeting.title,
      type: meeting.category,
      region: meeting.location,
      address: meeting.address,
      latitude: meeting.latitude,
      longitude: meeting.longitude,
      date,
      time,
      registrationEndDate: regDate,
      registrationEndTime: regTime,
      capacity: meeting.capacity,
      image: meeting.image,
      description: meeting.description,
    });
    setInitializedMeetingId(meeting.id);
  }

  const handleField = <K extends keyof EditMeetingFormState>(
    field: K,
    value: EditMeetingFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const payload: MeetingUpdateRequest = {
      name: form.name,
      type: form.type,
      region: form.region,
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      dateTime: combineKSTDateTimeToISO(form.date, form.time),
      registrationEnd: combineKSTDateTimeToISO(
        form.registrationEndDate,
        form.registrationEndTime,
      ),
      capacity: form.capacity,
      image: form.image,
      description: form.description,
    };

    editMutation.mutate(payload, {
      onSuccess: () => onClose(),
    });
  };

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
                    value={form.type || null}
                    placeholder="모임 종류를 선택하세요"
                    onChange={(v) => handleField("type", v)}
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
                    value={form.name}
                    onChange={(e) => handleField("name", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <AddressSearchField
                    address={form.region}
                    detailAddress={form.address}
                    onSelectAddress={({ address, latitude, longitude }) =>
                      setForm((prev) => ({
                        ...prev,
                        region: address,
                        latitude: latitude ?? prev.latitude,
                        longitude: longitude ?? prev.longitude,
                      }))
                    }
                    onDetailAddressChange={(v) => handleField("address", v)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="meeting-image" required>
                    이미지
                  </Label>
                  <ImageUploadField
                    value={form.image}
                    alt={meeting?.title}
                    onFileSelect={(file) => {
                      const previewUrl = URL.createObjectURL(file);
                      handleField("image", previewUrl);
                      // TODO: 실제 업로드는 useUploadImageMutation 연결 후 publicUrl로 교체
                    }}
                    onRemove={() => handleField("image", "")}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="meeting-description" required>
                    모임 설명
                  </Label>
                  <TextArea
                    id="meeting-description"
                    required
                    value={form.description}
                    onChange={(e) => handleField("description", e.target.value)}
                  />
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
                      value={form.date}
                      onChange={(v) => handleField("date", v)}
                    />
                    <TimeField
                      value={form.time}
                      onChange={(v) => handleField("time", v)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="meeting-registrationEnd" required>
                    모임 마감 날짜
                  </Label>
                  <div className="flex gap-3">
                    <DateField
                      value={form.registrationEndDate}
                      onChange={(v) => handleField("registrationEndDate", v)}
                      // }}
                    />
                    <TimeField
                      value={form.registrationEndTime}
                      onChange={(v) => handleField("registrationEndTime", v)}
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
                    value={form.capacity}
                    onChange={(e) =>
                      handleField("capacity", Number(e.target.value))
                    }
                  />
                </div>
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
          onClick={handleSubmit}
        >
          수정하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditMeetingModal;
