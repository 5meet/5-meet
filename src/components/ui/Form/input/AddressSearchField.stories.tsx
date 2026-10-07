import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddressSearchField } from "./AddressSearchField";

const meta = {
  title: "Components/Input/AddressSearchField",
  component: AddressSearchField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    address: {
      control: "text",
      description: "현재 선택된 주소",
    },
    onSelectAddress: {
      action: "selected",
      description: "주소 선택 시 호출되는 함수",
    },
  },
} satisfies Meta<typeof AddressSearchField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [address, setAddress] = useState(args.address);

    return (
      <div className="w-[500px]">
        <AddressSearchField
          {...args}
          address={address}
          onSelectAddress={(result) => {
            setAddress(result.address);
            args.onSelectAddress(result);
          }}
        />
      </div>
    );
  },
  args: {
    address: "",
  },
};

export const WithAddress: Story = {
  render: (args) => {
    const [address, setAddress] = useState(args.address);

    return (
      <div className="w-[500px]">
        <AddressSearchField
          {...args}
          address={address}
          onSelectAddress={(result) => {
            setAddress(result.address);
            args.onSelectAddress(result);
          }}
        />
      </div>
    );
  },
  args: {
    address: "서울특별시 중구 세종대로 110",
  },
};

// 사용 예시
// <AddressSearchField
//   address={form.region}
//   detailAddress={form.address}
//   onSelectAddress={({ address, latitude, longitude }) =>
//     setForm((prev) => ({ ...prev, region: address, latitude, longitude }))
//   }
//   onDetailAddressChange={(v) => handleField("address", v)}
// />
