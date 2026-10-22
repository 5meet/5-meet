import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { KakaoShareButton } from "./KakaoShareButton";

const meta = {
  title: "Features/MeetingDetail/KakaoShareButton",
  component: KakaoShareButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClick: () => {},
    isLoading: false,
  },
} satisfies Meta<typeof KakaoShareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Interactive: Story = {
  render: function Render() {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
      setIsLoading(true);

      // 스토리에서 로딩 상태를 확인하기 위한 예시입니다.
      // 실제 공유 API를 호출하지 않습니다.
    };

    return <KakaoShareButton onClick={handleClick} isLoading={isLoading} />;
  },
};
