import { MeetingFormState } from "../types/meetingForm";

export type ValidationResult = string | null;

// ---- 개별 필드 규칙 ----

export const validateMeetingType = (type: string): ValidationResult => {
  if (type.trim().length === 0) return "모임 종류를 선택해주세요.";
  return null;
};

const NAME_MAX_LENGTH = 20;

export const validateMeetingName = (name: string): ValidationResult => {
  const trimmed = name.trim();
  if (trimmed.length === 0) return "모임 이름을 입력해주세요.";
  if (name.length > NAME_MAX_LENGTH)
    return `모임 이름은 최대 ${NAME_MAX_LENGTH}자까지 입력할 수 있습니다.`;
  return null;
};

export const validateMeetingRegion = (region: string): ValidationResult => {
  if (region.trim().length === 0) return "장소를 검색해주세요.";
  return null;
};

export const validateMeetingAddress = (address: string): ValidationResult => {
  if (address.trim().length === 0) return "상세 주소를 입력해주세요.";
  return null;
};

export const validateMeetingImage = (
  image?: string | null,
): ValidationResult => {
  if (!image?.trim()) {
    return "모임 이미지를 등록해주세요.";
  }

  return null;
};

export const validateMeetingDescription = (
  description: string,
): ValidationResult => {
  if (description.trim().length === 0) return "모임 설명을 입력해주세요.";
  return null;
};

export const validateMeetingDate = (date: string): ValidationResult => {
  if (date.trim().length === 0) return "날짜를 선택해주세요.";
  return null;
};

export const validateMeetingTime = (time: string): ValidationResult => {
  if (time.trim().length === 0) return "시간을 선택해주세요.";
  return null;
};

export const validateRegistrationEndDate = (date: string): ValidationResult => {
  if (date.trim().length === 0) return "마감 날짜를 선택해주세요.";
  return null;
};

export const validateRegistrationEndTime = (time: string): ValidationResult => {
  if (time.trim().length === 0) return "마감 시간을 선택해주세요.";
  return null;
};

export const validateMeetingCapacity = (capacity: number): ValidationResult => {
  if (!Number.isFinite(capacity) || capacity <= 0)
    return "정원을 입력해주세요.";
  if (!Number.isInteger(capacity)) return "정원은 숫자만 입력할 수 있습니다.";
  return null;
};

// ---- 필드 간 교차 검증 (서버의 REGISTRATION_END_BEFORE_DATETIME, DATETIME_MUST_BE_FUTURE와 대응) ----

export const validateDateTimeIsFuture = (
  date: string,
  time: string,
): ValidationResult => {
  if (!date || !time) return null; // 개별 필드 에러가 이미 처리하므로 여기선 생략
  const target = new Date(`${date}T${time}:00+09:00`);
  if (Number.isNaN(target.getTime()))
    return "날짜/시간 형식이 올바르지 않습니다.";
  if (target.getTime() <= Date.now()) return "모임 일시는 미래여야 합니다.";
  return null;
};

export const validateRegistrationEndBeforeDateTime = (
  form: Pick<
    MeetingFormState,
    "date" | "time" | "registrationEndDate" | "registrationEndTime"
  >,
): ValidationResult => {
  const { date, time, registrationEndDate, registrationEndTime } = form;
  if (!date || !time || !registrationEndDate || !registrationEndTime)
    return null;

  const meetingDateTime = new Date(`${date}T${time}:00+09:00`);
  const registrationEnd = new Date(
    `${registrationEndDate}T${registrationEndTime}:00+09:00`,
  );

  if (
    Number.isNaN(meetingDateTime.getTime()) ||
    Number.isNaN(registrationEnd.getTime())
  ) {
    return null;
  }

  if (registrationEnd.getTime() >= meetingDateTime.getTime()) {
    return "모집 마감일은 모임 일시 이전이어야 합니다.";
  }

  return null;
};

// ---- 폼 전체 검증 (배열 + reduce) ----

interface FieldRule {
  key: keyof MeetingFormState;
  validate: (form: MeetingFormState) => ValidationResult;
}

const FIELD_RULES: FieldRule[] = [
  { key: "type", validate: (f) => validateMeetingType(f.type) },
  { key: "name", validate: (f) => validateMeetingName(f.name) },
  { key: "region", validate: (f) => validateMeetingRegion(f.region) },
  { key: "address", validate: (f) => validateMeetingAddress(f.address) },
  { key: "image", validate: (f) => validateMeetingImage(f.image) },
  {
    key: "description",
    validate: (f) => validateMeetingDescription(f.description),
  },
  { key: "date", validate: (f) => validateMeetingDate(f.date) },
  { key: "time", validate: (f) => validateMeetingTime(f.time) },
  {
    key: "registrationEndDate",
    validate: (f) => validateRegistrationEndDate(f.registrationEndDate),
  },
  {
    key: "registrationEndTime",
    validate: (f) => validateRegistrationEndTime(f.registrationEndTime),
  },
  { key: "capacity", validate: (f) => validateMeetingCapacity(f.capacity) },
];

export type MeetingFormErrors = Partial<Record<keyof MeetingFormState, string>>;

/**
 * 폼 전체를 검증해 필드별 에러 메시지를 반환합니다.
 * 에러가 없는 필드는 키 자체가 없습니다(errors.name이 undefined).
 */
export const validateMeetingForm = (
  form: MeetingFormState,
): MeetingFormErrors => {
  const fieldErrors = FIELD_RULES.reduce<MeetingFormErrors>(
    (acc, { key, validate }) => {
      const message = validate(form);
      if (message) acc[key] = message;
      return acc;
    },
    {},
  );

  // 개별 필드가 전부 통과했을 때만 교차 검증(날짜 비교 등)을 추가로 수행
  if (Object.keys(fieldErrors).length === 0) {
    const futureError = validateDateTimeIsFuture(form.date, form.time);
    if (futureError) fieldErrors.date = futureError;

    const orderError = validateRegistrationEndBeforeDateTime(form);
    if (orderError) fieldErrors.registrationEndDate = orderError;
  }

  return fieldErrors;
};

export const isMeetingFormValid = (form: MeetingFormState): boolean =>
  Object.keys(validateMeetingForm(form)).length === 0;
