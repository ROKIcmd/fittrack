import { useEffect, useState } from "react";

// Counts from 0 up to `to` (skipped if the user prefers reduced motion).
export default function CountUp({ to, decimals = 1, duration = 1200, delay = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf, start;
    const t = setTimeout(() => {
      const step = (now) => {
        start ??= now;
        const p = Math.min((now - start) / duration, 1);
        setV(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [to, duration, delay]);
  return <>{v.toFixed(decimals)}</>;
}
