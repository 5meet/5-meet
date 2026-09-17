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
    dateTime: {
      control: "text",
      description: "모임이 진행되는 날짜와 시간",
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
  dateTime: "2026-10-07T00:30:00.000Z",
  registrationEnd: "2026-09-16T14:00:00.000Z",
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
    dateTime: "2026-09-16T21:30:00.000Z",
    registrationEnd: "2026-09-16T20:00:00.000Z",
    order: "deadline-first",
  },
};

export const FutureMeeting: Story = {
  args: {
    dateTime: "2026-11-10T14:00:00.000Z",
    registrationEnd: "2026-11-09T14:59:59.000Z",
    order: "deadline-first",
  },
};

export const ClosedMeeting: Story = {
  args: {
    dateTime: "2026-08-14T00:30:00.000Z",
    registrationEnd: "2026-08-10T14:00:00.000Z",
    order: "deadline-first",
  },
};
