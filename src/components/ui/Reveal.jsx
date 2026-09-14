import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import useRevealed from "./useRevealed";

/**
 * Révélation au défilement : le contenu monte depuis un masque.
 * `as` permet de conserver une sémantique correcte (li, figure, etc.).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 34,
  duration = 1.05,
  className = "",
  as = "div",
  amount = 0.3,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const revealed = useRevealed(ref, amount);
  const Tag = motion[as] ?? motion.div;

  const from = reduced ? { opacity: 0 } : { opacity: 0, y };
  const to = reduced ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <Tag
      ref={ref}
      className={className}
      initial={from}
      animate={revealed ? to : from}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
