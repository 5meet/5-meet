import type { Meta, StoryObj } from "@storybook/nextjs";

import MeetingProgressBar from "./MeetingProgressBar";

const meta = {
  title: "Components/ProgressBar/MeetingProgressBar",
  component: MeetingProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    percentage: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
      description: "참가자 비율",
    },
    count: {
      control: {
        type: "number",
        min: 0,
        max: 20,
      },
      description: "현재 참가자 수",
    },
  },
} satisfies Meta<typeof MeetingProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percentage: 50,
    count: 10,
  },
};

export const FewParticipants: Story = {
  args: {
    percentage: 25,
    count: 5,
  },
};

export const Full: Story = {
  args: {
    percentage: 100,
    count: 20,
  },
};
