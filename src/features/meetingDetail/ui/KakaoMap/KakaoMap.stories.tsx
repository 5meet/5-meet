import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import KakaoMap from "./KakaoMap";

const meta = {
  title: "Features/MeetingDetail/KakaoMap",
  component: KakaoMap,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    latitude: {
      control: { type: "number", step: 0.0001 },
      description: "지도 중심 위도",
    },
    longitude: {
      control: { type: "number", step: 0.0001 },
      description: "지도 중심 경도",
    },
    address: {
      control: "text",
      description: "모임 장소 주소",
    },
    placeName: {
      control: "text",
      description: "마커 클릭 시 표시할 장소명",
    },
  },
  args: {
    latitude: 37.5665,
    longitude: 126.978,
    address: "서울특별시 중구 세종대로 110",
    placeName: "서울시청",
  },
} satisfies Meta<typeof KakaoMap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="h-[400px] w-[600px] overflow-hidden rounded-2xl">
      <KakaoMap {...args} />
    </div>
  ),
};

export const Gangnam: Story = {
  args: {
    latitude: 37.4979,
    longitude: 127.0276,
    address: "서울특별시 강남구 강남대로",
    placeName: "강남역",
  },
  render: (args) => (
    <div className="h-[400px] w-[600px] overflow-hidden rounded-2xl">
      <KakaoMap {...args} />
    </div>
  ),
};

export const Busan: Story = {
  args: {
    latitude: 35.1796,
    longitude: 129.0756,
    address: "부산광역시 중구 중앙대로",
    placeName: "부산역",
  },
  render: (args) => (
    <div className="h-[400px] w-[600px] overflow-hidden rounded-2xl">
      <KakaoMap {...args} />
    </div>
  ),
};
