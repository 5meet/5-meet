"use client";

// 모임 만들기 2단계 기본 정보(name, address, imageUrl) 정하기
import { useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useUploadImageMutation } from "@/features/images/hooks/useUploadImageMutation";
import { getUploadErrorMessage } from "@/features/images/utils/getUploadErrorMessage";

import { Label } from "@/components/ui/Form/label/Label";
import { Input } from "@/components/ui/Form/input/Input";
import { AddressSearchField } from "@/components/ui/Form/input/AddressSearchField";
import { ImageUploadField } from "@/components/ui/Form/input/ImageUploadField";
import { showToast } from "@/components/ui/Sonner";

import type { MeetingFormValues } from "@/features/meetings/types/meetings";
import type { AppError } from "@/lib/api/type";

export function InfoStep() {
  const { register, setValue, watch } = useFormContext<MeetingFormValues>();

  const address = watch("address");
  const detailAddress = watch("detailAddress");
  const image = watch("image");

  const uploadImageMutation = useUploadImageMutation();
  const uploadRequestIdRef = useRef(0);

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

  // 주소 검색
  const handleSelectAddress = ({
    region,
    address,
    latitude,
    longitude,
  }: {
    region: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
  }) => {
    if (latitude === null || longitude === null) {
      showToast({
        kind: "error",
        message: "주소의 위치를 확인할 수 없어요. 다른 주소를 선택해주세요.",
      });
      return;
    }

    setValue("address", address, { shouldValidate: true });
    setValue("region", region, { shouldValidate: true });
    setValue("latitude", latitude, { shouldValidate: true });
    setValue("longitude", longitude, { shouldValidate: true });
  };

  // 이미지 업로드: 선택 즉시 미리보기 반영 후, 백그라운드에서 업로드하고 성공/실패에 따라 URL 교체
  const handleImageUpload = (file: File) => {
    const previousImage = image;
    const requestId = ++uploadRequestIdRef.current;

    revokePendingBlob();

    const previewUrl = URL.createObjectURL(file);
    pendingBlobUrlRef.current = previewUrl;
    setValue("image", previewUrl, { shouldValidate: true });

    uploadImageMutation.mutate(file, {
      onSuccess: (publicUrl) => {
        if (requestId !== uploadRequestIdRef.current) return; // 오래된 결과는 무시
        revokePendingBlob();
        setValue("image", publicUrl, { shouldValidate: true });
      },
      onError: (error) => {
        if (requestId !== uploadRequestIdRef.current) return;
        revokePendingBlob();
        setValue("image", previousImage, { shouldValidate: true });
        showToast({
          kind: "error",
          message: getUploadErrorMessage(error),
        });
      },
    });
  };

  // 이미지 삭제
  const handleImageRemove = () => {
    uploadRequestIdRef.current++; // 진행 중이던 요청을 무효화
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
          required
        />
      </div>

      {/* 장소 */}
      <AddressSearchField
        address={address}
        detailAddress={detailAddress}
        isDetailDisabled={!address}
        onSelectAddress={handleSelectAddress}
        onDetailAddressChange={(value) =>
          setValue("detailAddress", value, { shouldValidate: true })
        }
      />

      {/* 이미지 */}
      <div className="space-y-2">
        <Label htmlFor="meeting-image" required>
          이미지
        </Label>

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
