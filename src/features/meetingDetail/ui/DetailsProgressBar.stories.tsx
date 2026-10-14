import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import DetailsProgressBar from "./DetailsProgressBar";

const meta = {
  title: "Components/ProgressBar/DetailsProgressBar",
  component: DetailsProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    participantCount: {
      control: {
        type: "number",
        min: 0,
      },
      description: "현재 참가자 수",
    },
    capacity: {
      control: {
        type: "number",
        min: 1,
      },
      description: "최대 참가 인원",
    },
  },
} satisfies Meta<typeof DetailsProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    participantCount: 5,
    capacity: 10,
  },
};

export const FewParticipants: Story = {
  args: {
    participantCount: 2,
    capacity: 10,
  },
};

export const Full: Story = {
  args: {
    participantCount: 10,
    capacity: 10,
  },
};
