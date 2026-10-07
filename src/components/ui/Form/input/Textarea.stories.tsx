import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TextArea from "./TextArea";
import { Label } from "@/components/ui/Form/label/Label";

const meta = {
  title: "Components/Input/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    errMsg: {
      control: "text",
      description:
        "에러 메시지. 입력값이 5자 미만이면 기본 에러 메시지가 표시됩니다.",
    },
    placeholder: {
      control: "text",
      description: "입력 전 표시되는 안내 문구",
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="description">모임 설명</Label>

      <TextArea />
    </div>
  ),
};

export const Valid: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="description">모임 설명</Label>

      <TextArea value="5자 이상의 정상적인 입력 내용입니다." />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="description">모임 설명</Label>

      <TextArea value="짧은 내용" errMsg="5자 이상 입력해주세요" />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="description" required>
        모임 설명
      </Label>

      <TextArea required />
    </div>
  ),
};
