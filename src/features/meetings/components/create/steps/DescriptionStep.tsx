import { useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/Form/label/Label";
import TextArea from "@/components/ui/Form/input/Textarea";

import type { CreateMeetingFormValues } from "../CreateMeetingModal";

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
