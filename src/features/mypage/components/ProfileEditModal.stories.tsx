import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ProfileEditModal from "./ProfileEditModal";

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
  title: "Features/Mypage/ProfileEditModal",
  component: ProfileEditModal,
  args: {
    isOpen: true,
    name: "럽윈즈올",
    email: "lovewins@codeit.com",
    imageSrc: "/profile/profile_female1.svg",
    onClose: () => undefined,
    onSubmit: () => undefined,
  },
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: viewports,
    },
  },
} satisfies Meta<typeof ProfileEditModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  globals: {
    viewport: {
      value: "mobile",
      isRotated: false,
    },
  },
};

export const Tablet: Story = {
  globals: {
    viewport: {
      value: "tablet",
      isRotated: false,
    },
  },
};

export const Desktop: Story = {
  globals: {
    viewport: {
      value: "desktop",
      isRotated: false,
    },
  },
};
