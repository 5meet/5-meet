import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImageUploadField } from "./ImageUploadField";

const meta = {
  title: "Components/Input/ImageUploadField",
  component: ImageUploadField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "현재 이미지 미리보기 URL",
    },
    onFileSelect: {
      action: "fileSelected",
      description: "이미지 파일 선택 시 호출되는 함수",
    },
  },
} satisfies Meta<typeof ImageUploadField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <ImageUploadField
        {...args}
        value={value}
        onFileSelect={(file) => {
          const previewUrl = URL.createObjectURL(file);

          setValue(previewUrl);
          args.onFileSelect(file);
        }}
      />
    );
  },
  args: {
    value: "",
  },
};

export const WithImage: Story = {
  args: {
    value: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  },
};
