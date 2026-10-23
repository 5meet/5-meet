import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import Calendar, { type DateRange } from "./Calendar";

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, "args">;

export const Single: Story = {
  render: function Render() {
    const [value, setValue] = useState("2026-10-20");
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="relative min-h-96 w-80">
        <p className="mb-4 text-sm">선택 날짜: {value || "선택 안 함"}</p>

        {isOpen ? (
          <Calendar
            mode="single"
            value={value}
            onApply={setValue}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <button
            type="button"
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => setIsOpen(true)}
          >
            달력 열기
          </button>
        )}
      </div>
    );
  },
};

export const SingleEmpty: Story = {
  render: function Render() {
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="relative min-h-96 w-80">
        <p className="mb-4 text-sm">선택 날짜: {value || "선택 안 함"}</p>

        {isOpen ? (
          <Calendar
            mode="single"
            value={value}
            onApply={setValue}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <button
            type="button"
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => setIsOpen(true)}
          >
            달력 열기
          </button>
        )}
      </div>
    );
  },
};

export const Range: Story = {
  render: function Render() {
    const [value, setValue] = useState<DateRange>({
      start: "2026-10-10",
      end: "2026-10-20",
    });
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="relative min-h-96 w-80">
        <p className="mb-4 text-sm">
          선택 기간: {value.start || "시작일 미선택"} ~{" "}
          {value.end || "종료일 미선택"}
        </p>

        {isOpen ? (
          <Calendar
            mode="range"
            value={value}
            onApply={setValue}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <button
            type="button"
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => setIsOpen(true)}
          >
            달력 열기
          </button>
        )}
      </div>
    );
  },
};

export const RangeEmpty: Story = {
  render: function Render() {
    const [value, setValue] = useState<DateRange>({
      start: "",
      end: "",
    });
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="relative min-h-96 w-80">
        <p className="mb-4 text-sm">
          선택 기간: {value.start || "시작일 미선택"} ~{" "}
          {value.end || "종료일 미선택"}
        </p>

        {isOpen ? (
          <Calendar
            mode="range"
            value={value}
            onApply={setValue}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <button
            type="button"
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => setIsOpen(true)}
          >
            달력 열기
          </button>
        )}
      </div>
    );
  },
};
