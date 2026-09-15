const KST_TIME_ZONE = "Asia/Seoul";

interface MeetingDate {
  date: string;
  time: string;
}

const formatMeetingDate = (dateTime: string): MeetingDate => {
  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    throw new Error("유효하지 않은 날짜 형식입니다.");
  }

  const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIME_ZONE,
    month: "numeric",
    day: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
  };
};

export default formatMeetingDate;
