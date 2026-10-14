import Image from "next/image";
import formatRegistrationEnd from "@/lib/convertDate/formatRegistrationEnd";
import { useIsPastDeadline } from "@/lib/hooks/useIsPastDeadline";

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
  const isClosed = useIsPastDeadline(registrationEnd); // 구조분해 없이 바로 받음
  const { text: registrationEndText, isClosed: formatIsClosed } =
    formatRegistrationEnd(registrationEnd);

  console.log({
    registrationEnd,
    isClosed_fromHook: isClosed,
    isClosed_fromFormat: formatIsClosed,
    registrationEndText,
  });

  const deadlineTag = (
    <div
      className={`flex h-7 shrink-0 items-center gap-1 rounded-lg pr-2 pl-1 text-xs lg:text-sm font-semibold ${
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
    <div className="flex h-7 shrink-0 items-center gap-2">
      <div className="flex h-7 items-center rounded-lg border border-gray-200 px-2">
        <span className="text-xs font-medium text-gray-600 lg:text-sm">
          {date}
        </span>
      </div>

      <div className="flex h-7 items-center rounded-lg border border-gray-200 px-2">
        <span className="text-xs font-medium text-gray-600 lg:text-sm">
          {time}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-wrap items-center gap-2 md:flex-nowrap">
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
