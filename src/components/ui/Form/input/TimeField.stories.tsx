import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TimeField } from "./TimeField";

const meta = {
  title: "Components/Input/TimeField",
  component: TimeField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "선택된 시간 (HH:mm)",
    },
    onChange: {
      action: "changed",
      description: "시간 선택 시 호출되는 함수",
    },
  },
} satisfies Meta<typeof TimeField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div className="w-64">
        <TimeField
          {...args}
          value={value}
          onChange={(time) => {
            setValue(time);
            args.onChange(time);
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
    value: "17:30",
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div className="w-64">
        <TimeField
          {...args}
          value={value}
          onChange={(time) => {
            setValue(time);
            args.onChange(time);
          }}
        />
      </div>
    );
  },
  args: {
    value: "",
  },
};
