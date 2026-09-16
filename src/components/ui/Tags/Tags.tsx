import Image from "next/image";
import formatMeetingDate from "@/lib/date/formatMeetingDate";
import formatRegistrationEnd from "@/lib/date/formatRegistrationEnd";
interface TagsProps {
  dateTime: string;
  registrationEnd: string;
}
const Tags = ({ dateTime, registrationEnd }: TagsProps) => {
  const { date, time } = formatMeetingDate(dateTime);
  const { text: registrationEndText, isClosed } =
    formatRegistrationEnd(registrationEnd);

  return (
    <div className="flex w-full items-center gap-2">
      {/* 모임 마감 날짜 Tag */}
      <div
        className={`flex items-center gap-1 rounded-lg pr-2 pl-1 py-0.5 text-sm font-semibold ${isClosed ? "text-error-100 bg-[#FF4D4D]/20" : "text-blue-600 bg-[#18DCFF]/20"}`}
      >
        <Image
          src="/ic_alarm.svg"
          alt="모임 마감 날짜 아이콘"
          width={24}
          height={24}
        />
        <span>{registrationEndText}</span>
      </div>

      {/* 모임 일정 Tag */}
      <div className="rounded-lg border border-gray-200 px-2 py-0.5">
        <span className="text-sm font-medium text-gray-600">{date}</span>
      </div>

      <div className="rounded-lg border border-gray-200 px-2 py-0.5">
        <span className="text-sm font-medium text-gray-600">{time}</span>
      </div>
    </div>
  );
};

export default Tags;
