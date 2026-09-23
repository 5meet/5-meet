// 1초 간격으로 input을 검증하는 함수
// 현재 로그인, 회원가입에서 사용중인데 모임 생성 form에서도 사용 가능성 있어서 lib폴더에 배치

import { useEffect } from "react";
import { FieldValues, Path, UseFormTrigger, FormState } from "react-hook-form";

interface UseDebouncedTriggerProps<T extends FieldValues> {
  trigger: UseFormTrigger<T>;
  touchedFields: FormState<T>["touchedFields"];
  value: string | undefined;
  field: Path<T>;
  additionalFieldName?: Path<T>; //함께 검사할 연관 필드 이름
  shouldTriggerAdditional?: boolean; //연관 필드 검증할지 결정하는 불리언
  delay?: number; // 필요 시 시간 조절 가능 (기본값 1000ms)
}

export function useDebouncedTrigger<T extends FieldValues>({
  trigger,
  touchedFields,
  value,
  field,
  additionalFieldName,
  shouldTriggerAdditional = false,
  delay = 1000,
}: UseDebouncedTriggerProps<T>) {
  const isTouched = !!(touchedFields as Record<string, unknown>)[field];

  useEffect(() => {
    // 필드를 건드리지 않았고 값이 비어있다면 검증 스킵
    if (value === undefined || (!isTouched && value === "")) return;

    // input에 값을 입력하고 1초가 지나면 자동으로 trigger을 통해서 검증합니다.
    const timer = setTimeout(() => {
      void trigger(field);

      if (additionalFieldName && shouldTriggerAdditional) {
        void trigger(additionalFieldName);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [
    value,
    field,
    isTouched,
    additionalFieldName,
    shouldTriggerAdditional,
    delay,
    trigger,
  ]);
}
