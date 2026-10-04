import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DateField } from "./DateField";

const meta = {
  title: "Components/Input/DateField",
  component: DateField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "선택된 날짜 (YYYY-MM-DD)",
    },
    onChange: {
      action: "changed",
      description: "날짜 선택 시 호출되는 함수",
    },
  },
} satisfies Meta<typeof DateField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div className="w-64">
        <DateField
          {...args}
          value={value}
          onChange={(date) => {
            setValue(date);
            args.onChange(date);
          }}
        />
      </div>
    );
  },
  args: {
    value: "",
  },
};

export const Selected: Story = {
  args: {
    value: "2026-10-07",
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div className="w-64">
        <DateField
          {...args}
          value={value}
          onChange={(date) => {
            setValue(date);
            args.onChange(date);
          }}
        />
      </div>
    );
  },
  args: {
    value: "",
  },
};
