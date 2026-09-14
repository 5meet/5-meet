"use client";

import Image from "next/image";

interface Props {
  type: "first" | "prev" | "next" | "last";
  disabled: boolean;
  onClick: () => void;
}

const ariaLabelMap = {
  first: "첫 페이지로 이동",
  prev: "이전 페이지로 이동",
  next: "다음 페이지로 이동",
  last: "마지막 페이지로 이동",
} as const;

const PageArrowButton = ({ type, disabled, onClick }: Props) => {
  const isLeft = type === "first" || type === "prev";
  const isDouble = type === "first" || type === "last";

  const icon = isLeft
    ? disabled
      ? "/arrow_left_disabled.svg"
      : "/arrow_left.svg"
    : disabled
      ? "/arrow_right_disabled.svg"
      : "/arrow_right.svg";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex p-2"
      aria-label={ariaLabelMap[type]}
    >
      <Image src={icon} alt="" width={24} height={24} />
      {isDouble && (
        <Image src={icon} alt="" width={24} height={24} className="-ml-2" />
      )}
    </button>
  );
};

export default PageArrowButton;
