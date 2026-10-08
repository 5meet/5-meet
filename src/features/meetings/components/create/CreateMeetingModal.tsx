"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { CategoryStep } from "./steps/CategoryStep";
import { InfoStep } from "./steps/InfoStpe";
import { DescriptionStep } from "./steps/DescriptionStep";
import ScheduleStep from "./steps/ScheduleStep";

const TOTAL_STEPS = 4;

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CreateMeetingFormValues {
  type: string;
  name: string;
  address: string;
  detailAddress: string;
  image: string;
  description: string;
  date: string;
  time: string;
  registrationEndDate: string;
  registrationEndTime: string;
  capacity: number;
}

export function CreateMeetingModal({
  isOpen,
  onClose,
}: CreateMeetingModalProps) {
  const [step, setStep] = useState(1);

  const methods = useForm<CreateMeetingFormValues>({
    defaultValues: {
      type: "",
      name: "",
      address: "",
      detailAddress: "",
      image: "",
      description: "",
      date: "",
      time: "",
      registrationEndDate: "",
      registrationEndTime: "",
      capacity: 0,
    },
  });

  const selectedType = methods.watch("type");
  const name = methods.watch("name");
  const address = methods.watch("address");
  const image = methods.watch("image");
  const description = methods.watch("description");
  const date = methods.watch("date");
  const time = methods.watch("time");
  const registrationEndDate = methods.watch("registrationEndDate");
  const registrationEndTime = methods.watch("registrationEndTime");
  const capacity = methods.watch("capacity");

  // 다음 버튼 비활성화 조건
  const isNextDisabled =
    (step === 1 && !selectedType) ||
    (step === 2 && (!name.trim() || !address.trim() || !image)) ||
    (step === 3 && !description.trim()) ||
    (step === 4 &&
      (!date ||
        !time ||
        !registrationEndDate ||
        !registrationEndTime ||
        !capacity));

  const handleNextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    methods.reset();
    setStep(1);
    onClose();
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
          <Button onClick={handleNextStep} disabled={isNextDisabled}>
            {step === TOTAL_STEPS ? "모임 만들기" : "다음"}
          </Button>
        </Modal.Footer>
      </FormProvider>
    </Modal>
  );
}
