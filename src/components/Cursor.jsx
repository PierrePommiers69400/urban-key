import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import "./cursor.css";

/**
 * Curseur sur mesure : un anneau doré qui suit le pointeur avec inertie
 * et s'ouvre au survol des éléments interactifs.
 */
export default function Cursor() {
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [variant, setVariant] = useState("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ring = { x: useSpring(x, { stiffness: 180, damping: 20, mass: 0.6 }), y: useSpring(y, { stiffness: 180, damping: 20, mass: 0.6 }) };
  const dot = { x: useSpring(x, { stiffness: 900, damping: 42 }), y: useSpring(y, { stiffness: 900, damping: 42 }) };

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e) => {
      const target = e.target.closest("[data-cursor], a, button, input, textarea, select");
      if (!target) {
        setVariant("default");
        setLabel("");
        return;
      }
      setVariant(target.dataset.cursor || "link");
      setLabel(target.dataset.cursorLabel || "");
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const scale = variant === "link" ? 1.9 : variant === "view" ? 3.6 : variant === "text" ? 0.4 : 1;

  return (
    <>
      <motion.div
        className={`cursor-ring cursor-ring--${variant}`}
        style={{ x: ring.x, y: ring.y }}
        animate={{ scale, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {label ? <span className="cursor-ring__label">{label}</span> : null}
      </motion.div>
      <motion.div
        className="cursor-dot"
        style={{ x: dot.x, y: dot.y }}
        animate={{ opacity: visible && variant === "default" ? 1 : 0 }}
      />
    </>
  );
}
