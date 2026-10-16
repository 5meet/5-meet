import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within, expect } from "storybook/test";

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

export const NameOnly: Story = { args: { allowImageEdit: false } };

export const Saving: Story = {
  args: { allowImageEdit: false, onSubmit: () => new Promise<void>(() => {}) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText("이름", { exact: true }));
    await userEvent.type(canvas.getByLabelText("이름", { exact: true }), "변경한 이름");
    await userEvent.click(canvas.getByRole("button", { name: "수정하기" }));
    await expect(canvas.getByRole("button", { name: /수정하기/ })).toBeDisabled();
  },
};

export const SaveError: Story = {
  args: { allowImageEdit: false, onSubmit: async () => { throw new Error("이름을 저장하지 못했어요. 잠시 후 다시 시도해주세요."); } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText("이름", { exact: true }));
    await userEvent.type(canvas.getByLabelText("이름", { exact: true }), "변경한 이름");
    await userEvent.click(canvas.getByRole("button", { name: "수정하기" }));
    await expect(canvas.getByRole("alert")).toBeVisible();
    await expect(canvas.getByLabelText("이름", { exact: true })).toHaveValue("변경한 이름");
  },
};
