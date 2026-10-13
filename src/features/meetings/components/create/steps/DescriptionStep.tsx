// 모임 만들기 3단계 설명(description) 정하기
import { useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/Form/label/Label";
import TextArea from "@/components/ui/Form/input/Textarea";

import type { CreateMeetingFormValues } from "@/features/meetings/types/meetings";

export function DescriptionStep() {
  const { register } = useFormContext<CreateMeetingFormValues>();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="meeting-description" required>
          모임 설명
        </Label>

        <TextArea
          id="meeting-description"
          placeholder="모임 이름을 입력해주세요"
          {...register("description")}
          required
        />
      </div>
    </div>
  );
}
