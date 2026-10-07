import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ProfileCard from "./ProfileCard";

const meta = {
  title: "Features/Mypage/ProfileCard",
  component: ProfileCard,
  args: {
    name: "럽윈즈올",
    email: "lovewins@codeit.com",
    imageSrc: "/profile/profile_female1.svg",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="w-[343px]">
        <Story />
      </div>
    ),
  ],
};

export const Tablet: Story = {
  decorators: [
    (Story) => (
      <div className="w-[696px]">
        <Story />
      </div>
    ),
  ],
};

export const Desktop: Story = {
  decorators: [
    (Story) => (
      <div className="w-[282px]">
        <Story />
      </div>
    ),
  ],
};
