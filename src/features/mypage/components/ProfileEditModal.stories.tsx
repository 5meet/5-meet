import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ProfileEditModal from "./ProfileEditModal";

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
  },
} satisfies Meta<typeof ProfileEditModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
