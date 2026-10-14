import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MyMeetingsView from "./MyMeetingsView";

const meta = {
  title: "Features/Mypage/MyMeetingsView",
  component: MyMeetingsView,
  parameters: { layout: "padded" },
} satisfies Meta<typeof MyMeetingsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: { status: "loading" },
};

export const Empty: Story = {
  args: { status: "success", meetings: [] },
};

export const Error: Story = {
  args: { status: "error" },
};

export const WithMeetings: Story = {
  args: {
    status: "success",
    meetings: [
      {
        id: 1,
        name: "주말 독서 모임",
        category: "스터디",
        region: "서울 성동구",
        dateLabel: "10월 17일",
        timeLabel: "14:00",
        participantCount: 4,
        capacity: 8,
        isCompleted: false,
      },
      {
        id: 2,
        name: "지난 운동 모임",
        category: "운동/건강",
        region: "서울 마포구",
        dateLabel: "10월 3일",
        timeLabel: "10:00",
        participantCount: 6,
        capacity: 10,
        isCompleted: true,
      },
    ],
  },
};
