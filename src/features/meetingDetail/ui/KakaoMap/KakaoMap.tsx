"use client";

import { useEffect, useRef, useState } from "react";
import { KakaoMapScript } from "./KakaoMapScript";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

const KakaoMap = ({ latitude, longitude, address }: KakaoMapProps) => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 지도 생성 + 중심/마커 갱신
  useEffect(() => {
    if (!isReady || !mapDivRef.current) return;

    const position = new window.kakao.maps.LatLng(latitude, longitude);

    if (!mapRef.current) {
      mapRef.current = new window.kakao.maps.Map(mapDivRef.current, {
        center: position,
        level: 3,
      });
    } else {
      mapRef.current.setCenter(position);
    }

    markerRef.current?.setMap(null);
    const marker = new window.kakao.maps.Marker({ position });
    marker.setMap(mapRef.current);
    markerRef.current = marker;

    return () => {
      marker.setMap(null);
    };
  }, [isReady, latitude, longitude]);

  useEffect(() => {
    if (!isReady || !mapDivRef.current || !mapRef.current) return;

    const observer = new ResizeObserver(() => {
      const map = mapRef.current;

      if (!map) return;

      map.relayout();

      const position = new window.kakao.maps.LatLng(latitude, longitude);

      map.setCenter(position);
    });

    observer.observe(mapDivRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isReady, latitude, longitude]);

  // 언마운트 시 참조 정리
  useEffect(() => {
    return () => {
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <KakaoMapScript
        onReady={() => setIsReady(true)}
        onError={() => setHasError(true)}
      />
      <div
        ref={mapDivRef}
        className="h-full w-full bg-gray-100"
        role="img"
        aria-label={`모임 장소: ${address}`}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-500">
          지도를 불러오지 못했습니다.
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
