import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { Label } from "@/components/ui/form/label/Label";

const meta = {
  title: "components/Form/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    placeholder: "내용을 입력해주세요",
    disabled: false,
    isError: false,
  },
  argTypes: {
    isError: {
      control: "boolean",
      description: "입력값 오류 여부",
    },
    disabled: {
      control: "boolean",
      description: "placeholder 입력창 비활성화 여부",
    },
    placeholder: {
      control: "text",
      description: "placeholder 텍스트",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">이메일</Label>
      <Input id="email" type="email" placeholder="이메일을 입력해주세요" />
    </div>
  ),
};
export const Required: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email" required>
        이메일
      </Label>

      <Input
        id="email"
        type="email"
        placeholder="이메일을 입력해주세요"
        required
      />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email" required>
        이메일
      </Label>

      <Input
        id="email"
        type="email"
        isError
        placeholder="이메일을 입력해주세요"
        required
        aria-invalid
        aria-describedby='email-error'
      />
      <p id="email-error" className="text-sm text-error-100">
        올바른 이메일 형식을 입력해주세요.
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">이메일</Label>

      <Input
        id="email"
        type="email"
        placeholder="이메일을 입력해주세요"
        disabled
      />
    </div>
  ),
};