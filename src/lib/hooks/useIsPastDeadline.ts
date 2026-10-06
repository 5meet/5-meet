// hooks/useIsPastDeadline.ts
import { useEffect, useState } from "react";

/**
 * 주어진 ISO 시각이 "이미 지났는지"를 추적합니다.
 * 처음엔 즉시 계산하고, 그 시각이 되면 정확히 한 번 리렌더를 트리거합니다.
 */
const computeIsPast = (isoDateTime: string) =>
  new Date(isoDateTime).getTime() <= Date.now();

export function useIsPastDeadline(isoDateTime: string): boolean {
  const [isPast, setIsPast] = useState(() => computeIsPast(isoDateTime));
  const [prevIsoDateTime, setPrevIsoDateTime] = useState(isoDateTime);

  // isoDateTime이 바뀌면, 렌더링 중에 바로 새 값 기준으로 재계산 (이펙트 없이)
  if (isoDateTime !== prevIsoDateTime) {
    setPrevIsoDateTime(isoDateTime);
    setIsPast(computeIsPast(isoDateTime));
  }

  // "아직 안 지난 미래 시점"을 구독하는 타이머만 이펙트가 담당
  useEffect(() => {
    const target = new Date(isoDateTime).getTime();
    const now = Date.now();

    if (target <= now) return;

    const timer = setTimeout(() => setIsPast(true), target - now);
    return () => clearTimeout(timer);
  }, [isoDateTime]);

  return isPast;
}
