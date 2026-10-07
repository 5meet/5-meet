import { useEffect, useState } from "react";

/**
 * 주어진 ISO 시각이 "이미 지났는지"를 추적합니다.
 * 처음엔 즉시 계산하고, 그 시각이 되면 정확히 한 번 리렌더를 트리거합니다.
 */
const computeIsPast = (isoDateTime: string) =>
  new Date(isoDateTime).getTime() <= Date.now();

// setTimeout이 안전하게 다룰 수 있는 최대 지연시간 (32비트 정수 한계보다 여유 있게 설정)
// 여기서는 "24시간 이내로 마감되는 경우에만 자동 갱신 타이머를 건다"는 기준으로 잡음
const MAX_SAFE_TIMEOUT_MS = 24 * 60 * 60 * 1000;

export function useIsPastDeadline(isoDateTime: string): boolean {
  // key를 isoDateTime으로 삼아, 값이 바뀌면 React가 state를 자동으로 리셋하게 함
  const [state, setState] = useState(() => ({
    isoDateTime,
    isPast: computeIsPast(isoDateTime),
  }));

  // isoDateTime이 바뀌면, 렌더링 중에 바로 새 값 기준으로 재계산 (이펙트 없이)
  if (state.isoDateTime !== isoDateTime) {
    setState({ isoDateTime, isPast: computeIsPast(isoDateTime) });
  }

  // "아직 안 지난 미래 시점"을 구독하는 타이머만 이펙트가 담당
  useEffect(() => {
    const target = new Date(isoDateTime).getTime();
    const now = Date.now();
    const delay = target - now;

    // 이미 지났거나, 너무 먼 미래(안전한 setTimeout 범위를 벗어남)라면 타이머를 걸지 않음
    if (delay <= 0 || delay > MAX_SAFE_TIMEOUT_MS) return;

    const timer = setTimeout(() => {
      setState((prev) =>
        prev.isoDateTime === isoDateTime ? { ...prev, isPast: true } : prev,
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [isoDateTime]);

  return state.isPast;
}
