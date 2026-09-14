import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { stats } from "../data/content";
import Counter from "./ui/Counter";
import Reveal from "./ui/Reveal";
import "./stats.css";

export default function Stats() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const wordX = useTransform(scrollYProgress, [0, 1], ["-14%", "10%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["25%", "-25%"]);

  return (
    <section className="stats on-navy" ref={ref} data-nav-theme="dark">
      <motion.span className="stats__ghost" style={reduced ? undefined : { x: wordX }} aria-hidden="true">
        Performance
      </motion.span>
      <motion.div className="stats__glow" style={reduced ? undefined : { y: glowY }} aria-hidden="true" />

      <div className="shell stats__inner">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="stat">
            <span className="stat__value">
              <Counter to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
            </span>
            <span className="stat__label">{s.label}</span>
            <span className="stat__note">{s.note}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
