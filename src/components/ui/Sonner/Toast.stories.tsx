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
      onClick={() => {
        const toastId = showToast({
          kind: "loading",
          message: "처리 중입니다...",
        });

        setTimeout(() => {
          showToast({
            kind: "success",
            message: "처리가 완료되었습니다.",
            id: toastId,
          });
        }, 2000);
      }}
    >
      Loading Toast
    </button>
  ),
};

// 현재 Loading Toast는 Storybook 테스트 용이라 setTimeout을 사용했지만,
// 실제 코드에서는 아래와 같은 형태로 사용해야 합니다. (API 성공/실패 시 같은 toastId를 전달하는 구조)

// const toastId = showToast({
//   kind: "loading",
//   message: "처리 중입니다...",
// });

// try {
//   await api();

//   showToast({
//     kind: "success",
//     message: "처리가 완료되었습니다.",
//     id: toastId,
//   });
// } catch {
//   showToast({
//     kind: "error",
//     message: "처리에 실패했습니다.",
//     id: toastId,
//   });
// }
