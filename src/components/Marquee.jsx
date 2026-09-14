import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "motion/react";
import { useRef } from "react";
import { marqueeWords } from "../data/content";
import "./marquee.css";

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export default function Marquee({ speed = 34 }) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 48, stiffness: 380 });
  const factor = useTransform(smooth, [-1400, 0, 1400], [-5, 0, 5], { clamp: false });
  const skew = useTransform(smooth, [-1400, 0, 1400], [-4, 0, 4], { clamp: true });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let move = ((direction.current * speed * delta) / 1000 / window.innerWidth) * 100;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += move * Math.abs(f);
    baseX.set(baseX.get() + move * -1);
  });

  const items = [...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords];

  return (
    <div className="marquee on-navy" aria-hidden="true">
      <motion.div className="marquee__track" style={{ x, skewX: reduced ? 0 : skew }}>
        {items.map((word, i) => (
          <span className="marquee__item" key={i}>
            {word}
            <svg className="marquee__sep" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1" />
              <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
