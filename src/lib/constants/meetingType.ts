import { DropdownOption } from "@/components/ui/Dropdown/InputDropdown";

// 아래는 임시 label입니다. 실제 백엔드가 허용하는 값 목록을 채워야 합니다.
// 현재 백엔드에서는 모임 종류를 팀별로 커스텀할 수 있습니다.

// 수정/생성 폼 전용 (전체 없음) — 실제로는 API에서 가져오는 게 정확함
export const MEETING_TYPE_OPTIONS: DropdownOption<string>[] = [
  { label: "달램핏", value: "달램핏" },
  { label: "취미/여가", value: "취미/여가" },
  { label: "자기계발", value: "자기계발" },
  { label: "비즈니스", value: "비즈니스" },
  { label: "라이프스타일", value: "라이프스타일" },
  { label: "가족/육아", value: "가족/육아" },
];

// 필터 전용 (전체 포함)
export const MEETING_TYPE_FILTER_OPTIONS = [
  { label: "전체", value: "all" },
  ...MEETING_TYPE_OPTIONS,
];
