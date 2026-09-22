import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MeetingDetailInfoCard from "./infoCard";

const meta = {
  title: "Components/MeetingDetail/InfoCard",
  component: MeetingDetailInfoCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "모임 이름",
    },
    location: {
      control: "text",
      description: "모임 장소",
    },
    category: {
      control: "text",
      description: "모임 유형",
    },
    dateTime: {
      control: "text",
      description: "모임 일정",
    },
    registrationEnd: {
      control: "text",
      description: "모임 모집 마감 시간",
    },
    isOwner: {
      control: "boolean",
      description: "현재 사용자가 모임 주최자인지 여부",
    },
    initialIsParticipating: {
      control: "boolean",
      description: "현재 사용자가 모임에 참여 중인지 여부",
    },
    participantCount: {
      control: {
        type: "number",
        min: 0,
      },
      description: "현재 참여 인원",
    },
    capacity: {
      control: {
        type: "number",
        min: 1,
      },
      description: "모임 최대 인원",
    },
    initialIsFavorited: {
      control: "boolean",
      description: "현재 사용자의 좋아요 여부",
    },
    isLoggedIn: {
      control: "boolean",
      description: "현재 사용자의 로그인 여부",
    },
  },
} satisfies Meta<typeof MeetingDetailInfoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  id: 1,
  title: "함께하는 주말 등산 모임",
  location: "중구",
  category: "취미/여가",
  dateTime: "2026-11-10T14:00:00.000Z",
  registrationEnd: "2026-11-09T14:59:59.000Z",
  isOwner: false,
  initialIsParticipating: false,
  participantCount: 3,
  capacity: 10,
  initialIsFavorited: false,
  isLoggedIn: true,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const Owner: Story = {
  args: {
    ...defaultArgs,
    isOwner: true,
  },
};

export const Participating: Story = {
  args: {
    ...defaultArgs,
    initialIsParticipating: true,
  },
};

export const Full: Story = {
  args: {
    ...defaultArgs,
    participantCount: 10,
    capacity: 10,
  },
};

export const Liked: Story = {
  args: {
    ...defaultArgs,
    initialIsFavorited: true,
  },
};

export const Closed: Story = {
  args: {
    ...defaultArgs,
    registrationEnd: "2026-09-15T14:59:59.000Z",
  },
};

export const LoggedOut: Story = {
  args: {
    ...defaultArgs,
    isLoggedIn: false,
  },
};

export const LongTitle: Story = {
  args: {
    ...defaultArgs,
    title:
      "주말에 함께 서울 근교로 떠나는 초보자를 위한 가벼운 등산 모임입니다",
    location: "서울특별시 중구",
  },
};

export const LongTitleOwner: Story = {
  args: {
    ...defaultArgs,
    title:
      "주말에 함께 서울 근교로 떠나는 초보자를 위한 가벼운 등산 모임입니다",
    location: "서울특별시 중구",
    isOwner: true,
  },
};
