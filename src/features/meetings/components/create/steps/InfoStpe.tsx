"use client";

import { ImagePlus } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/Form/input/Input";
import { Label } from "@/components/ui/Form/label/Label";

import type { CreateMeetingFormValues } from "../CreateMeetingModal";
import { AddressSearchField } from "@/components/ui/Form/input/AddressSearchField";

export function InfoStep() {
  const { register, setValue, watch } =
    useFormContext<CreateMeetingFormValues>();

  const address = watch("address");
  const detailAddress = watch("detailAddress");


  const handleImageUpload = () => {
    console.log("이미지 첨부 버튼 클릭");

    setValue("imageSelected", true);
  };

  return (
    <div className="space-y-6">
      {/* 모임 이름 */}
      <div className="space-y-2">
        <Label htmlFor="meeting-name" required>
          모임 이름
        </Label>

        <Input
          id="meeting-name"
          type="text"
          placeholder="모임 이름을 입력해주세요"
          {...register("name")}
        />
      </div>

      {/* 장소 */}
      <AddressSearchField
        address={address}
        detailAddress={detailAddress}
        onSelectAddress={(result) => {
          setValue("address", result.address, {
            shouldValidate: true,
          });
        }}
        onDetailAddressChange={(value) => {
          setValue("detailAddress", value, {
            shouldValidate: true,
          });
        }}
      />

      {/* 이미지 */}
      <div className="space-y-2">
        <Label required>이미지</Label>

        <button
          type="button"
          onClick={handleImageUpload}
          className="
            flex h-36 w-36 cursor-pointer
            flex-col items-center justify-center
            gap-2 rounded-2xl bg-gray-100
            text-gray-400 transition
            hover:bg-gray-200
          "
        >
          <ImagePlus className="h-6 w-6" />

          <span className="text-sm">파일 첨부</span>
        </button>
      </div>
    </div>
  );
}
