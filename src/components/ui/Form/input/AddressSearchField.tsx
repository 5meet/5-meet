"use client";

import Script from "next/script";
import { useState } from "react";
import { Input } from "@/components/ui/Form/input/Input";
import { Label } from "@/components/ui/Form/label/Label";

interface AddressSearchResult {
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressSearchFieldProps {
  address: string;
  detailAddress: string;
  onSelectAddress: (result: AddressSearchResult) => void;
  onDetailAddressChange: (value: string) => void;
}

export const AddressSearchField = ({
  address,
  detailAddress,
  onSelectAddress,
  onDetailAddressChange,
}: AddressSearchFieldProps) => {
  const [isScriptReady, setIsScriptReady] = useState(false);

  const handleSearch = () => {
    if (!window.daum?.Postcode) return;

    new window.daum.Postcode({
      oncomplete: (data) => {
        const roadAddress: string = data.roadAddress || data.jibunAddress;

        if (window.kakao?.maps?.services) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(roadAddress, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              onSelectAddress({
                address: roadAddress,
                latitude: Number(result[0].y),
                longitude: Number(result[0].x),
              });
            } else {
              onSelectAddress({
                address: roadAddress,
                latitude: 0,
                longitude: 0,
              });
            }
          });
        } else {
          onSelectAddress({ address: roadAddress, latitude: 0, longitude: 0 });
        }
      },
    }).open();
  };

  return (
    <>
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
      />

      <div className="flex flex-col w-full gap-2">
        <Label htmlFor="address" required>
          장소
        </Label>
        <Input
          id="address"
          type="text"
          placeholder="건물, 지번 또는 도로명 검색"
          required
          value={address}
          readOnly
          onClick={handleSearch}
          disabled={!isScriptReady}
        />
        <Input
          id="addressDetail"
          type="text"
          placeholder="상세주소"
          required
          value={detailAddress}
          onChange={(e) => onDetailAddressChange(e.target.value)}
        />
      </div>
    </>
  );
};
