import { useEffect, useRef, useState } from "react";

const useCountUp = (target: number, duration = 1000) => {
  const [count, setCount] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const currentCount = Math.floor(target * progress);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [target, duration]);

  return count;
};

export default useCountUp;
