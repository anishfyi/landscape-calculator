import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  format: (value: number) => string;
  durationMs?: number;
  ariaLabel?: string;
}

export const AnimatedNumber = ({ value, format, durationMs = 300, ariaLabel }: AnimatedNumberProps) => {
  const [display, setDisplay] = useState<number>(value);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(value);

  useEffect(() => {
    const from = display;
    fromRef.current = from;
    const to = value;
    const start = performance.now();
    startRef.current = start;

    const step = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      // ease in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setDisplay(fromRef.current + (to - fromRef.current) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return (
    <span aria-label={ariaLabel}>{format(display)}</span>
  );
};


