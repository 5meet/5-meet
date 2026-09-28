import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MyPageTabs from "@/features/mypage/components/MyPageTabs";

const meta = {
  title: "Features/Mypage/MyPageTabs",
  component: MyPageTabs,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof MyPageTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
};

export const MyMeetingsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/mypage/meetings",
      },
    },
  },
};

export const MyReviewsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/mypage/reviews",
      },
    },
  },
};

export const CreatedMeetingsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/mypage/created-meetings",
      },
    },
  },
};
