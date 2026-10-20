import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputDropdown, DropdownOption } from "./InputDropdown";

const categoryOptions: DropdownOption<string>[] = [
  { label: "전체", value: "all" },
  { label: "취미/여가", value: "취미/여가" },
  { label: "스터디", value: "스터디" },
  { label: "비즈니스", value: "비즈니스" },
  { label: "운동/건강", value: "운동/건강" },
  { label: "가족/육아", value: "가족/육아" },
  { label: "기타", value: "기타" },
];

const meta = {
  title: "Components/Input/InputDropdown",
  component: InputDropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: "object",
      description: "드롭다운에서 선택할 수 있는 옵션 목록",
    },
    value: {
      control: "text",
      description: "현재 선택된 옵션의 value",
    },
    onChange: {
      action: "changed",
      description: "옵션을 선택했을 때 호출되는 함수",
    },
    placeholder: {
      control: "text",
      description: "선택된 값이 없을 때 표시할 문구",
    },
    disabled: {
      control: "boolean",
      description: "드롭다운 비활성화 여부",
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
    },
  },
} satisfies Meta<typeof InputDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(args.value);

    return <InputDropdown {...args} value={value} onChange={setValue} />;
  },

  args: {
    options: categoryOptions,
    value: null,
    placeholder: "카테고리를 선택해주세요",
    disabled: false,
    className: "w-64",
  },
};

export const Selected: Story = {
  args: {
    options: categoryOptions,
    value: "hobby",
    placeholder: "카테고리를 선택해주세요",
    disabled: false,
    className: "w-64",
  },
};

export const Disabled: Story = {
  args: {
    options: categoryOptions,
    value: "hobby",
    placeholder: "카테고리를 선택해주세요",
    disabled: true,
    className: "w-64",
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(args.value);

    return <InputDropdown {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: categoryOptions,
    value: null,
    placeholder: "카테고리를 선택해주세요",
    disabled: false,
    className: "w-64",
  },
};
