"use client";

import { useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useUploadImageMutation } from "@/features/images/hooks/useUploadImageMutation";

import { Input } from "@/components/ui/Form/input/Input";
import { Label } from "@/components/ui/Form/label/Label";
import { AddressSearchField } from "@/components/ui/Form/input/AddressSearchField";
import { ImageUploadField } from "@/components/ui/Form/input/ImageUploadField";
import { showToast } from "@/components/ui/Sonner";

import type { CreateMeetingFormValues } from "../CreateMeetingModal";

export function InfoStep() {
  const { register, setValue, watch } =
    useFormContext<CreateMeetingFormValues>();

  const address = watch("address");
  const detailAddress = watch("detailAddress");
  const image = watch("image");

  const uploadImageMutation = useUploadImageMutation();

  // 아직 업로드가 끝나지 않은(또는 실패한) blob URL을 추적
  const pendingBlobUrlRef = useRef<string | null>(null);
  const revokePendingBlob = () => {
    if (pendingBlobUrlRef.current) {
      URL.revokeObjectURL(pendingBlobUrlRef.current);
      pendingBlobUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      revokePendingBlob();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 이미지 업로드: 선택 즉시 미리보기 반영 후, 백그라운드에서 업로드하고 성공/실패에 따라 URL 교체
  const handleImageUpload = (file: File) => {
    const previousImage = image;
    revokePendingBlob();

    const previewUrl = URL.createObjectURL(file);
    pendingBlobUrlRef.current = previewUrl;
    setValue("image", previewUrl, { shouldValidate: true });

    uploadImageMutation.mutate(file, {
      onSuccess: (publicUrl) => {
        revokePendingBlob();
        setValue("image", publicUrl, { shouldValidate: true });
      },
      onError: () => {
        revokePendingBlob();
        setValue("image", previousImage, { shouldValidate: true });
        showToast({
          kind: "error",
          message: "이미지 업로드에 실패했습니다. 다시 시도해주세요.",
        });
      },
    });
  };

  // 이미지 삭제
  const handleImageRemove = () => {
    revokePendingBlob();
    setValue("image", "", { shouldValidate: true });
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

        <ImageUploadField
          value={image}
          alt={watch("name") || "모임 이미지"}
          onFileSelect={handleImageUpload}
          onRemove={handleImageRemove}
        />
      </div>
    </div>
  );
}
