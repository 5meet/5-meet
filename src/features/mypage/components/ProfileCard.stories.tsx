import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ProfileCard from "./ProfileCard";

const viewports = {
  mobile: {
    name: "Mobile 375",
    styles: {
      width: "375px",
      height: "812px",
    },
  },
  tablet: {
    name: "Tablet 744",
    styles: {
      width: "744px",
      height: "1133px",
    },
  },
  desktop: {
    name: "Desktop 1920",
    styles: {
      width: "1920px",
      height: "1080px",
    },
  },
};

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
    viewport: {
      options: viewports,
    },
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  globals: {
    viewport: {
      value: "mobile",
      isRotated: false,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[343px]">
        <Story />
      </div>
    ),
  ],
};

export const Tablet: Story = {
  globals: {
    viewport: {
      value: "tablet",
      isRotated: false,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[696px]">
        <Story />
      </div>
    ),
  ],
};

export const Desktop: Story = {
  globals: {
    viewport: {
      value: "desktop",
      isRotated: false,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[282px]">
        <Story />
      </div>
    ),
  ],
};
