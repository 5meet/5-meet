"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { showToast } from "@/components/ui/Sonner";
import { CategoryStep, InfoStep, DescriptionStep, ScheduleStep } from "./steps";
import { useCreateMeetingMutation } from "@/features/meetings/hooks/useCreateMeetingMutation";
import { mapToCreateMeeting } from "@/features/meetings/meetings.mapper";
import {
  validateMeetingCapacity,
  validateDateTimeIsFuture,
  validateRegistrationEndBeforeDateTime,
} from "@/lib/validators/meetingFormValidators";
import type { MeetingFormValues } from "@/features/meetings/types/meetings";

const TOTAL_STEPS = 4;

const DEFAULT_VALUES: MeetingFormValues = {
  type: "",
  name: "",
  region: "",
  address: "",
  detailAddress: "",
  latitude: 0,
  longitude: 0,
  image: "",
  description: "",
  date: "",
  time: "",
  registrationEndDate: "",
  registrationEndTime: "",
  capacity: 0,
};

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMeetingModal({
  isOpen,
  onClose,
}: CreateMeetingModalProps) {
  const [step, setStep] = useState(1);
  const createMutation = useCreateMeetingMutation();
  const methods = useForm<MeetingFormValues>({ defaultValues: DEFAULT_VALUES });

  const [
    type,
    name,
    address,
    latitude,
    longitude,
    image,
    description,
    date,
    time,
    regEndDate,
    regEndTime,
    capacity,
  ] = methods.watch([
    "type",
    "name",
    "address",
    "latitude",
    "longitude",
    "image",
    "description",
    "date",
    "time",
    "registrationEndDate",
    "registrationEndTime",
    "capacity",
  ]);

  const capacityError = validateMeetingCapacity(capacity);

  // 다음 버튼 비활성화 조건
  const isNextDisabled =
    (step === 1 && !type) ||
    (step === 2 &&
      (!name.trim() ||
        !address.trim() ||
        latitude === 0 ||
        longitude === 0 ||
        !image ||
        image.startsWith("blob:"))) ||
    (step === 3 && !description.trim()) ||
    (step === 4 &&
      (!date || !time || !regEndDate || !regEndTime || capacityError !== null));

  // 모달 닫기
  const handleClose = () => {
    methods.reset(DEFAULT_VALUES);
    setStep(1);
    onClose();
  };

  // 모임 생성
  const handleSubmit = () => {
    const form = methods.getValues();

    const error =
      validateMeetingCapacity(form.capacity) ??
      validateDateTimeIsFuture(form.date, form.time) ??
      validateRegistrationEndBeforeDateTime(form);

    if (error) {
      showToast({ kind: "error", message: error });
      return;
    }

    // 폼 값(MeetingFormValues) → 요청 Body(MeetingCreateRequest)
    createMutation.mutate(mapToCreateMeeting(form), {
      onSuccess: handleClose,
    });
  };

  // 다음 버튼
  const handleNextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }

    handleSubmit();
  };

  // 이전 버튼
  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      className="min-[744px]:max-w-lg"
    >
      <FormProvider {...methods}>
        <Modal.Header onClose={handleClose}>
          <Modal.Title>
            모임 만들기{" "}
            <span className="text-gray-400">
              {step}/{TOTAL_STEPS}
            </span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {step === 1 && <CategoryStep />}
          {step === 2 && <InfoStep />}
          {step === 3 && <DescriptionStep />}
          {step === 4 && <ScheduleStep />}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={step === 1 ? handleClose : handlePrevStep}
          >
            {step === 1 ? "취소" : "이전"}
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={isNextDisabled}
            isLoading={createMutation.isPending}
          >
            {step === TOTAL_STEPS ? "모임 만들기" : "다음"}
          </Button>
        </Modal.Footer>
      </FormProvider>
    </Modal>
  );
}
