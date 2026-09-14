import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import useRevealed from "./useRevealed";

/** Compteur qui s'incrémente lorsqu'il entre dans le champ de vision. */
export default function Counter({ to, decimals = 0, duration = 2.1, suffix = "" }) {
  const ref = useRef(null);
  const inView = useRevealed(ref, 0.6);
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const total = reduced ? 0 : duration * 1000;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = total === 0 ? 1 : Math.min((now - start) / total, 1);
      setValue(to * (1 - Math.pow(1 - t, 4)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration, reduced]);

  const formatted = value.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className="counter">
      {formatted}
      {suffix}
    </span>
  );
}
