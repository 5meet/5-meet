import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppToaster, showToast } from "./index";

const meta = {
  title: "Components/Toast",
  component: AppToaster,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <AppToaster />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof AppToaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  render: () => (
    <button
      type="button"
      onClick={() =>
        showToast({
          kind: "success",
          message: "성공적으로 처리되었습니다.",
        })
      }
    >
      Success Toast
    </button>
  ),
};

export const Error: Story = {
  render: () => (
    <button
      type="button"
      onClick={() =>
        showToast({
          kind: "error",
          message: "오류가 발생했습니다.",
        })
      }
    >
      Error Toast
    </button>
  ),
};

export const Warning: Story = {
  render: () => (
    <button
      type="button"
      onClick={() =>
        showToast({
          kind: "warning",
          message: "주의가 필요합니다.",
        })
      }
    >
      Warning Toast
    </button>
  ),
};

export const Info: Story = {
  render: () => (
    <button
      type="button"
      onClick={() =>
        showToast({
          kind: "info",
          message: "새로운 정보가 있습니다.",
        })
      }
    >
      Info Toast
    </button>
  ),
};

export const Loading: Story = {
  render: () => (
    <button
      type="button"
      onClick={() =>
        showToast({
          kind: "loading",
          message: "처리 중입니다...",
        })
      }
    >
      Loading Toast
    </button>
  ),
};
