"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

const KakaoMap = ({ latitude, longitude, address }: KakaoMapProps) => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);

  // 지도 초기 생성 — 한 번만 실행
  useEffect(() => {
    if (!mapDivRef.current) return;
    if (mapRef.current) return;

    const initMap = () => {
      if (!window.kakao?.maps) {
        // SDK 로드가 아직 안 끝났으면 잠시 후 다시 시도
        setTimeout(initMap, 50);
        return;
      }

      window.kakao.maps.load(() => {
        if (!mapDivRef.current) return;

        const center = new window.kakao.maps.LatLng(latitude, longitude);

        mapRef.current = new window.kakao.maps.Map(mapDivRef.current, {
          center,
          level: 3,
        });
      });
    };

    initMap();
    // 최초 1회만 지도를 생성하므로 의존성 배열은 비워둡니다.
    // 좌표가 바뀌는 경우는 아래 panTo용 effect가 담당합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 좌표가 바뀌면 지도 중심을 부드럽게 이동
  useEffect(() => {
    if (!mapRef.current) return;

    const nextCenter = new window.kakao.maps.LatLng(latitude, longitude);
    mapRef.current.panTo(nextCenter);
  }, [latitude, longitude]);

  // 주소 위치에 마커 하나만 표시 (좌표가 바뀌면 기존 마커 제거 후 재생성)
  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.kakao?.maps) return;

    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    const position = new window.kakao.maps.LatLng(latitude, longitude);
    const marker = new window.kakao.maps.Marker({ position });
    marker.setMap(mapRef.current);

    markerRef.current = marker;
  }, [latitude, longitude]);

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
      />
      <div
        ref={mapDivRef}
        className="h-full w-full bg-gray-100"
        role="img"
        aria-label={`모임 장소: ${address}`}
      />
    </>
  );
};

export default KakaoMap;
