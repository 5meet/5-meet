const KST_TIME_ZONE = "Asia/Seoul";
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

interface RegistrationEnd {
  text: string;
  isClosed: boolean;
}

const formatRegistrationEnd = (
  registrationEnd: string,
  now: Date = new Date(),
): RegistrationEnd => {
  const endDate = new Date(registrationEnd);

  if (Number.isNaN(endDate.getTime())) {
    throw new Error("유효하지 않은 날짜 형식입니다.");
  }

  if (endDate.getTime() <= now.getTime()) {
    return {
      text: "이미 마감된 모임입니다.",
      isClosed: true,
    };
  }

  const endDateString = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIME_ZONE,
  }).format(endDate);

  const nowDateString = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIME_ZONE,
  }).format(now);

  const endDay = new Date(`${endDateString}T00:00:00+09:00`);
  const nowDay = new Date(`${nowDateString}T00:00:00+09:00`);

  const dayDifference = Math.floor(
    (endDay.getTime() - nowDay.getTime()) / MILLISECONDS_PER_DAY,
  );

  const time = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(endDate);

  let text: string;

  if (dayDifference === 0) {
    text = `오늘 ${time} 마감`;
  } else if (dayDifference === 1) {
    text = `내일 ${time} 마감`;
  } else {
    text = `${dayDifference}일 후 마감`;
  }

  return {
    text,
    isClosed: false,
  };
};

export default formatRegistrationEnd;
