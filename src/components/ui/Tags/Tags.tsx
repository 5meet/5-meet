import Image from "next/image";
import formatRegistrationEnd from "@/lib/convertDate/formatRegistrationEnd";

interface TagsProps {
  date: string;
  time: string;
  registrationEnd: string;
  order?: "deadline-first" | "date-first";
}

const Tags = ({
  date,
  time,
  registrationEnd,
  order = "deadline-first",
}: TagsProps) => {
  const { text: registrationEndText, isClosed } =
    formatRegistrationEnd(registrationEnd);

  const deadlineTag = (
    <div
      className={`flex shrink-0 items-center gap-1 rounded-lg py-0.5 pr-2 pl-1 text-sm font-semibold ${
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

  const datetimeTag = (
    <div className="flex shrink-0 items-center gap-2">
      <div className="rounded-lg border border-gray-200 px-2 py-0.5">
        <span className="text-sm font-medium text-gray-600">{date}</span>
      </div>

      <div className="rounded-lg border border-gray-200 px-2 py-0.5">
        <span className="text-sm font-medium text-gray-600">{time}</span>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      {order === "deadline-first" ? (
        <>
          {deadlineTag}
          {datetimeTag}
        </>
      ) : (
        <>
          {datetimeTag}
          {deadlineTag}
        </>
      )}
    </div>
  );
};

export default Tags;
