import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReviewCard from "./ReviewCard";

const meta = {
  title: "Components/MeetingDetail/ReviewCard/ReviewCard",
  component: ReviewCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    user: {
      control: "object",
      description: "리뷰 작성자 정보",
    },
    score: {
      control: {
        type: "number",
        min: 1,
        max: 5,
        step: 0.5,
      },
      description: "리뷰 평점",
    },
    comment: {
      control: "text",
      description: "리뷰 내용",
    },
    createdAt: {
      control: "text",
      description: "리뷰 작성일",
    },
  },
} satisfies Meta<typeof ReviewCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  id: 1,
  user: {
    id: 1,
    name: "이영희",
    image: "/profile/profile_female1.svg",
  },
  score: 5,
  comment: "친절하고 편안한 분위기에서 즐겁게 참여했습니다.",
  createdAt: "2026.09.21",
  isOwner: false,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const LowScore: Story = {
  args: {
    ...defaultArgs,
    score: 2,
    comment: "조금 아쉬운 부분이 있었습니다.",
  },
};

export const NoProfileImage: Story = {
  args: {
    ...defaultArgs,
    user: {
      ...defaultArgs.user,
      image: null,
    },
  },
};

export const LongComment: Story = {
  args: {
    ...defaultArgs,
    comment:
      "전체적으로 만족스러운 모임이었습니다. 진행도 원활했고 다른 참여자분들도 모두 친절해서 처음 참여했는데도 편안하게 즐길 수 있었습니다. 다음에도 기회가 된다면 다시 참여하고 싶습니다.",
  },
};
