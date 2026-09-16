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
  },
} satisfies Meta<typeof Tags>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dateTime: "2026-10-07T00:30:00.000Z",
    registrationEnd: "2026-09-16T14:00:00.000Z",
  },
};

export const TodayMeeting: Story = {
  args: {
    dateTime: "2026-09-16T21:30:00.000Z",
    registrationEnd: "2026-09-16T20:00:00.000Z",
  },
};

export const FutureMeeting: Story = {
  args: {
    dateTime: "2026-11-10T14:00:00.000Z",
    registrationEnd: "2026-11-09T14:59:59.000Z",
  },
};

export const ClosedMeeting: Story = {
  args: {
    dateTime: "2026-08-14T00:30:00.000Z",
    registrationEnd: "2026-08-10T14:00:00.000Z",
  },
};
