"use client";

import { useEffect, useRef, useState } from "react";
import { KakaoMapScript } from "./KakaoMapScript";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  address: string;
  placeName?: string;
}

const KakaoMap = ({
  latitude,
  longitude,
  address,
  placeName = "모임 장소",
}: KakaoMapProps) => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // 지도 생성 + 중심/마커 갱신 + 마커 클릭 이벤트(오버레이)
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

    const map = mapRef.current;

    markerRef.current?.setMap(null);
    const marker = new window.kakao.maps.Marker({ position, clickable: true });
    marker.setMap(map);
    markerRef.current = marker;

    const content = buildOverlayContent({
      placeName,
      address,
      latitude,
      longitude,
      onClose: () => overlay.setMap(null),
    });

    const overlay = new window.kakao.maps.CustomOverlay({
      position,
      content,
      yAnchor: 1.3, // 마커 아이콘 높이만큼 위로 띄움
      clickable: true, // 오버레이 안 클릭이 지도로 전달되지 않게
    });
    overlayRef.current = overlay;

    const handleMarkerClick = () => overlay.setMap(map);
    const handleMapClick = () => overlay.setMap(null);

    window.kakao.maps.event.addListener(marker, "click", handleMarkerClick);
    window.kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      window.kakao.maps.event.removeListener(
        marker,
        "click",
        handleMarkerClick,
      );
      window.kakao.maps.event.removeListener(map, "click", handleMapClick);
      marker.setMap(null);
    };
  }, [isReady, latitude, longitude, address, placeName]);

  // 화면 크기 변경 시 지도 레이아웃 재계산
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

  // 카카오맵 링크 (이름에 쉼표가 있으면 링크 형식이 깨지므로 제거)
  const safeName = encodeURIComponent(placeName.replace(/,/g, " "));
  const viewUrl = `https://map.kakao.com/link/map/${safeName},${latitude},${longitude}`;
  const routeUrl = `https://map.kakao.com/link/to/${safeName},${latitude},${longitude}`;

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

/* ----------------------------- 오버레이 DOM 생성 ----------------------------- */

interface OverlayParams {
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  onClose: () => void;
}

function buildOverlayContent({
  placeName,
  address,
  latitude,
  longitude,
  onClose,
}: OverlayParams): HTMLElement {
  const safeName = encodeURIComponent(placeName.replace(/,/g, " "));
  const viewUrl = `https://map.kakao.com/link/map/${safeName},${latitude},${longitude}`;
  const routeUrl = `https://map.kakao.com/link/to/${safeName},${latitude},${longitude}`;

  const root = document.createElement("div");
  root.className =
    "relative flex w-60 flex-col gap-2 rounded-2xl bg-white p-3 shadow-lg";

  // 헤더 (제목 + 닫기)
  const header = document.createElement("div");
  header.className = "flex items-start justify-between gap-2";

  const textWrap = document.createElement("div");
  textWrap.className = "flex min-w-0 flex-col gap-0.5";

  const title = document.createElement("strong");
  title.className = "truncate text-sm font-semibold text-black";
  title.textContent = placeName;

  const addr = document.createElement("span");
  addr.className = "text-xs font-normal text-gray-500";
  addr.textContent = address;

  textWrap.append(title, addr);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "닫기");
  closeBtn.className = "shrink-0 text-gray-400 hover:text-gray-600";
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", onClose);

  header.append(textWrap, closeBtn);

  // 링크 버튼
  const actions = document.createElement("div");
  actions.className = "flex gap-2";

  const makeLink = (href: string, label: string, primary: boolean) => {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = label;
    a.className = primary
      ? "flex-1 rounded-xl bg-primary-600 py-1.5 text-center text-xs font-medium text-white"
      : "flex-1 rounded-xl border border-gray-300 py-1.5 text-center text-xs font-medium text-black";
    return a;
  };

  actions.append(
    makeLink(viewUrl, "카카오맵", false),
    makeLink(routeUrl, "길찾기", true),
  );

  // 말풍선 꼬리
  const tail = document.createElement("div");
  tail.className =
    "absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 bg-white";

  root.append(header, actions, tail);
  return root;
}
