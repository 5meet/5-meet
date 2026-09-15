import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PersonnelCard from "./PersonnelCard";

const meta = {
  title: "Components/MettingDetail/PersonnelCard",
  component: PersonnelCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    participantCount: {
      control: {
        type: "number",
      },
      description: "현재 참여 중인 인원 수",
    },
    capacity: {
      control: {
        type: "number",
      },
      description: "모임의 최대 수용 인원",
    },
  },
} satisfies Meta<typeof PersonnelCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    participantCount: 3,
    capacity: 20,
  },
};

export const FewParticipants: Story = {
  args: {
    participantCount: 1,
    capacity: 20,
  },
};

export const HalfParticipants: Story = {
  args: {
    participantCount: 15,
    capacity: 30,
  },
};

export const FullParticipants: Story = {
  args: {
    participantCount: 10,
    capacity: 10,
  },
};
