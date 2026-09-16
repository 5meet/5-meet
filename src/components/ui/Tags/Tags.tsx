import Image from "next/image";
import formatMeetingDate from "@/lib/date/formatMeetingDate";
import formatRegistrationEnd from "@/lib/date/formatRegistrationEnd";

interface TagsProps {
  dateTime: string;
  registrationEnd: string;
  order?: "deadline-first" | "date-first";
}

// deadline-first : 마감일-날짜-시간 순서
// date-first : 날짜-시간-마감일 순서

const Tags = ({
  dateTime,
  registrationEnd,
  order = "deadline-first",
}: TagsProps) => {
  const { date, time } = formatMeetingDate(dateTime);
  const { text: registrationEndText, isClosed } =
    formatRegistrationEnd(registrationEnd);

  const deadlineTag = (
    <div
      className={`flex items-center gap-1 rounded-lg py-0.5 pr-2 pl-1 text-sm font-semibold ${
        isClosed
          ? "bg-[#FF4D4D]/20 text-error-100"
          : "bg-[#18DCFF]/20 text-blue-600"
      }`}
    >
      <Image
        src="/ic_alarm.svg"
        alt="모임 마감 날짜 아이콘"
        width={24}
        height={24}
      />
      <span>{registrationEndText}</span>
    </div>
  );

  const dateTag = (
    <div className="rounded-lg border border-gray-200 px-2 py-0.5">
      <span className="text-sm font-medium text-gray-600">{date}</span>
    </div>
  );

  const timeTag = (
    <div className="rounded-lg border border-gray-200 px-2 py-0.5">
      <span className="text-sm font-medium text-gray-600">{time}</span>
    </div>
  );

  return (
    <div className="flex w-full items-center gap-2">
      {order === "deadline-first" ? (
        <>
          {deadlineTag}
          {dateTag}
          {timeTag}
        </>
      ) : (
        <>
          {dateTag}
          {timeTag}
          {deadlineTag}
        </>
      )}
    </div>
  );
};

export default Tags;
