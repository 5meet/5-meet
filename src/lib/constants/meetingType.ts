import { DropdownOption } from "@/components/ui/Dropdown/InputDropdown";

// 아래는 임시 label입니다. 실제 백엔드가 허용하는 값 목록을 채워야 합니다.
// 현재 백엔드에서는 모임 종류를 팀별로 커스텀할 수 있습니다.
export const MEETING_TYPE_OPTIONS: DropdownOption<string>[] = [
  { label: "전체", value: "all" },
  { label: "달램핏", value: "example" },
  { label: "취미/여가", value: "hobby" },
  { label: "자기계발", value: "self-development" },
  { label: "비즈니스", value: "business" },
  { label: "라이프스타일", value: "lifestyle" },
  { label: "가족/육아", value: "family" },
];
