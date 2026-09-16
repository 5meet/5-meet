import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ParticipantProfiles from "./ParticipantProfiles";

const meta = {
  title: "Components/MettingDetail/ParticipantProfiles",
  component: ParticipantProfiles,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    participantCount: {
      control: {
        type: "number",
      },
      description: "전체 모임 참가자 수",
    },
    participants: {
      control: false,
      description: "프로필을 표시할 참가자 목록",
    },
  },
} satisfies Meta<typeof ParticipantProfiles>;

export default meta;

type Story = StoryObj<typeof meta>;

const participants = [
  {
    id: 1,
    name: "이영희",
    image: "/profile/profile_female1.svg",
  },
  {
    id: 2,
    name: "김철수",
    image: "/profile/profile_female1.svg",
  },
  {
    id: 3,
    name: "박민수",
    image: "/profile/profile_male.svg",
  },
  {
    id: 4,
    name: "최지은",
    image: "/profile/profile_female2.svg",
  },
];

export const NoParticipants: Story = {
  args: {
    participantCount: 0,
    participants: [],
  },
};

export const OneParticipant: Story = {
  args: {
    participantCount: 1,
    participants: participants.slice(0, 1),
  },
};

export const FourParticipants: Story = {
  args: {
    participantCount: 4,
    participants,
  },
};

export const FiveParticipants: Story = {
  args: {
    participantCount: 5,
    participants,
  },
};

export const EightParticipants: Story = {
  args: {
    participantCount: 8,
    participants,
  },
};
