import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
  useInView,
} from "motion/react";
import { useEffect, useRef } from "react";
import { marqueeWords } from "../data/content";
import "./marquee.css";

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export default function Marquee({ speed = 34 }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  // Hors de l'écran, le bandeau s'arrête : inutile de le calculer à chaque image.
  const inView = useInView(ref, { margin: "120px 0px" });
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  // Ressort souple : à la molette, la vitesse arrive par à-coups, cran après
  // cran ; un ressort raide les recopiait en saccades d'accélération.
  const smooth = useSpring(velocity, { damping: 40, stiffness: 120, mass: 0.8 });
  const factor = useTransform(smooth, [-1400, 0, 1400], [-2.4, 0, 2.4], { clamp: false });
  const skew = useTransform(smooth, [-1400, 0, 1400], [-2.5, 0, 2.5], { clamp: true });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  // Boucle propre au bandeau, montée seulement quand il est visible :
  // `useAnimationFrame` gardait la boucle de Motion éveillée sur toute la page.
  useEffect(() => {
    if (reduced || !inView) return undefined;
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      const delta = Math.min(now - last, 64);
      last = now;
      let move = ((direction.current * speed * delta) / 1000 / window.innerWidth) * 100;
      const f = factor.get();
      // Un seuil, et non le simple signe : en retombant, le ressort passe un
      // instant sous zéro, et le bandeau repartait à l'envers après chaque cran.
      if (f < -0.35) direction.current = -1;
      else if (f > 0.35) direction.current = 1;
      move += move * Math.abs(f);
      baseX.set(baseX.get() + move * -1);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, inView, speed, factor, baseX]);

  const items = [...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords];

  return (
    <div className={`marquee on-navy ${inView ? "" : "is-paused"}`} ref={ref} aria-hidden="true">
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
