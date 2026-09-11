import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}

export function useCountUp({
  end,
  duration = 2500,
  decimals = 0,
  suffix = "",
}: UseCountUpOptions) {
  const [value, setValue] = useState("0" + suffix);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const callbackRef = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
    return () => observer.disconnect();

    function animate() {
      const start = performance.now();

      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = Math.pow(progress, 0.35);
        const current = eased * end;

        setValue(current.toFixed(decimals) + suffix);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    }
  }, [element, end, duration, decimals, suffix]);

  return [value, callbackRef] as const;
}
