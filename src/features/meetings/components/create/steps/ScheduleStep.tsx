import { useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/Form/label/Label";
import { Input } from "@/components/ui/Form/input/Input";
import { DateField } from "@/components/ui/Form/input/DateField";
import { TimeField } from "@/components/ui/Form/input/TimeField";

import type { CreateMeetingFormValues } from "../CreateMeetingModal";

export default function ScheduleStep() {
  const { register, setValue, watch } =
    useFormContext<CreateMeetingFormValues>();

  const date = watch("date");
  const time = watch("time");
  const registrationEndDate = watch("registrationEndDate");
  const registrationEndTime = watch("registrationEndTime");

  return (
    <div className="space-y-6">
      {/* 모임 일정 */}
      <div className="space-y-2">
        <Label htmlFor="meeting-dateTime" required>
          모임 일정
        </Label>

        <div className="flex gap-3">
          <DateField
            value={date}
            onChange={(v) => setValue("date", v, { shouldValidate: true })}
          />
          <TimeField
            value={time}
            onChange={(v) => setValue("time", v, { shouldValidate: true })}
          />
        </div>
      </div>

      {/* 모집 마감 날짜 */}
      <div className="space-y-2">
        <Label htmlFor="meeting-registrationEnd" required>
          모집 마감 날짜
        </Label>

        <div className="flex gap-3">
          <DateField
            value={registrationEndDate}
            onChange={(v) =>
              setValue("registrationEndDate", v, { shouldValidate: true })
            }
          />
          <TimeField
            value={registrationEndTime}
            onChange={(v) =>
              setValue("registrationEndTime", v, { shouldValidate: true })
            }
          />
        </div>
      </div>

      {/* 모임 정원 */}
      <div className="space-y-2">
        <Label htmlFor="meeting-capacity" required>
          모임 정원
        </Label>

        <Input
          id="meeting-capacity"
          type="number"
          min={0}
          placeholder="모임 정원을 입력해주세요"
          {...register("capacity")}
          required
        />
      </div>
    </div>
  );
}
