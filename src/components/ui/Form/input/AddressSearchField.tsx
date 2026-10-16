"use client";

import Script from "next/script";
import { useState } from "react";
import { Input } from "@/components/ui/Form/input/Input";
import { Label } from "@/components/ui/Form/label/Label";
import { MapPin } from "lucide-react";
import { KakaoMapScript } from "@/features/meetingDetail/ui/KakaoMap/KakaoMapScript";

interface AddressSearchResult {
  region: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

interface AddressSearchFieldProps {
  address: string;
  detailAddress: string;
  onSelectAddress: (result: AddressSearchResult) => void;
  onDetailAddressChange: (value: string) => void;
  isDetailDisabled: boolean;
}

export const AddressSearchField = ({
  address,
  detailAddress,
  onSelectAddress,
  onDetailAddressChange,
  isDetailDisabled,
}: AddressSearchFieldProps) => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [isKakaoReady, setIsKakaoReady] = useState(false);

  // 지오코드(좌표 조회 실패 시 주소 선택 막기)
  const geocode = (region: string, roadAddress: string) => {
    const fail = () =>
      onSelectAddress({
        region,
        address: roadAddress,
        latitude: null,
        longitude: null,
      });

    if (!window.kakao?.maps?.services) return fail();

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(roadAddress, (result, status) => {
      const first = result?.[0];
      if (status !== window.kakao.maps.services.Status.OK || !first)
        return fail();

      const latitude = Number(first.y);
      const longitude = Number(first.x);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude))
        return fail();

      onSelectAddress({ region, address: roadAddress, latitude, longitude });
    });
  };

  const handleSearch = () => {
    if (!window.daum?.Postcode) return;

    new window.daum.Postcode({
      oncomplete: (data) => {
        const region = `${data.sido} ${data.sigungu}`.trim();
        const roadAddress: string = data.roadAddress || data.jibunAddress;

        geocode(region, roadAddress);
      },
    }).open();
  };

  return (
    <>
      <KakaoMapScript onReady={() => setIsKakaoReady(true)} />
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
      />

      <div className="flex flex-col w-full gap-2">
        <Label htmlFor="address" required>
          장소
        </Label>
        <div className="relative">
          <Input
            id="address"
            type="text"
            placeholder="건물, 지번 또는 도로명 검색"
            value={address}
            tabIndex={-1}
            onClick={handleSearch}
            disabled={!isScriptReady || !isKakaoReady}
            readOnly
            className="pr-12 cursor-default"
          />

          <button
            type="button"
            aria-label="주소 검색"
            onClick={handleSearch}
            disabled={!isScriptReady || !isKakaoReady}
            className="
              absolute top-1/2 right-4
              -translate-y-1/2
              cursor-pointer text-gray-700
              disabled:cursor-not-allowed
              disabled:text-gray-300
            "
          >
            <MapPin className="h-5 w-5" />
          </button>
        </div>

        <Input
          id="addressDetail"
          type="text"
          placeholder={
            isDetailDisabled ? "주소를 먼저 검색해주세요" : "상세주소"
          }
          disabled={isDetailDisabled}
          value={detailAddress}
          onChange={(e) => onDetailAddressChange(e.target.value)}
        />
      </div>
    </>
  );
};
