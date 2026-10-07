const KST_TIME_ZONE = "Asia/Seoul";

interface MeetingDate {
  date: string;
  time: string;
}

// type-1 : date: 12월 15일, time: 17:30
export function convertDateType1(dateTime: string): MeetingDate {
  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    throw new Error("날짜 형식 없음");
  }

  const dateParts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIME_ZONE,
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  const month = dateParts.find((part) => part.type === "month")?.value;
  const day = dateParts.find((part) => part.type === "day")?.value;

  const time = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return { date: `${month}월 ${day}일`, time };
}

// type-2 : 2025.12.25 10:25 or 3시간전 (24시간 이내)
export function convertDateType2(date: Date): string {
  if (!(date instanceof Date)) {
    date = new Date(date); //ISOstring 형식 등 변형 가능한 경우 변형
  }
  if (!(date instanceof Date)) return "날짜 형식 없음";

  const term = Date.now() - date.getTime();
  const oneHour = 1000 * 60 * 60;
  if (term < 24 * oneHour) {
    const termHour = Math.floor(term / oneHour) + 1;
    return `${termHour}시간 전`;
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const _date = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}.${month}.${_date} ${hours}:${minutes}`;
}

// type-3 : 2025-12-25
export function convertDateType3(date: Date): string {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) return "날짜 형식 없음";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// type-4 : 2025.12.25
export function convertDateType4(date: Date): string {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) return "날짜 형식 없음";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

// type-5 : 25.12.25
export function convertDateType5(date: Date): string {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) return "날짜 형식 없음";

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

// type-6 : 25.12.25(목) 오전 10:00
export function convertDateType6(date: Date): string {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) return "날짜 형식 없음";

  const weekMap = {
    0: "일",
    1: "월",
    2: "화",
    3: "수",
    4: "목",
    5: "금",
    6: "토",
  } as const;

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = weekMap[date.getDay() as keyof typeof weekMap];

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const meridiem = hours < 12 ? "오전" : "오후";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${year}.${month}.${day}(${weekday}) ${meridiem} ${hours}:${minutes}`;
}

// type-7 : 2025년 12월 25일 (목)
export function convertDateType7(date: Date): string {
  if (!(date instanceof Date)) {
    date = new Date(date); //ISOstring 형식 등 변형 가능한 경우 변형
  }
  if (!(date instanceof Date)) return "날짜 형식 없음";

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = date.getDay();
  type weekType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const KRWeek = {
    0: "일",
    1: "월",
    2: "화",
    3: "수",
    4: "목",
    5: "금",
    6: "토",
  };
  return `${year}년 ${month}월 ${day}일 (${KRWeek[weekday as weekType]})`;
}

//----------------------------------------------------

/**
 * ISO 문자열(UTC)을 KST 기준 "YYYY-MM-DD" / "HH:mm"으로 분리합니다.
 * 수정 폼처럼 DateField/TimeField에 각각 값을 채워야 할 때 사용합니다.
 */
export function splitISOToKSTDateTime(iso: string): MeetingDate {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    throw new Error("날짜 형식 없음");
  }

  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = dateParts.find((part) => part.type === "year")?.value;
  const month = dateParts.find((part) => part.type === "month")?.value;
  const day = dateParts.find((part) => part.type === "day")?.value;

  const time = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return { date: `${year}-${month}-${day}`, time };
}

/**
 * KST 기준 "YYYY-MM-DD" / "HH:mm"을 ISO 문자열(UTC)로 합칩니다.
 * 수정 폼에서 DateField/TimeField의 값을 API Body(dateTime, registrationEnd)로 보낼 때 사용합니다.
 */
export function combineKSTDateTimeToISO(date: string, time: string): string {
  const combined = new Date(`${date}T${time}:00+09:00`);

  if (Number.isNaN(combined.getTime())) {
    throw new Error("날짜 형식 없음");
  }

  return combined.toISOString();
}
