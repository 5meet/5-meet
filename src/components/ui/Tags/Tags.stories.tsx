import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Tags from "./Tags";

const meta = {
  title: "Components/Tags/Tags",
  component: Tags,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    date: {
      control: "text",
      description: "모임이 진행되는 날짜",
    },
    time: {
      control: "text",
      description: "모임이 진행되는 시간",
    },
    registrationEnd: {
      control: "text",
      description: "모임 모집 마감 날짜와 시간",
    },
    order: {
      control: "select",
      options: ["deadline-first", "date-first"],
      description: "태그가 표시되는 순서",
    },
  },
} satisfies Meta<typeof Tags>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  date: "10월 7일",
  time: "09:30",
  registrationEnd: "2026-09-28T14:00:00.000Z",
};

export const Default: Story = {
  args: {
    ...defaultArgs,
    order: "deadline-first",
  },
};

export const DateFirst: Story = {
  args: {
    ...defaultArgs,
    order: "date-first",
  },
};

export const TodayMeeting: Story = {
  args: {
    date: "9월 23일",
    time: "14:30",
    registrationEnd: "2026-09-23T10:00:00.000Z",
    order: "deadline-first",
  },
};

export const FutureMeeting: Story = {
  args: {
    date: "11월 10일",
    time: "23:00",
    registrationEnd: "2026-11-09T14:59:59.000Z",
    order: "deadline-first",
  },
};

export const ClosedMeeting: Story = {
  args: {
    date: "8월 14일",
    time: "09:30",
    registrationEnd: "2026-08-10T14:00:00.000Z",
    order: "deadline-first",
  },
};
