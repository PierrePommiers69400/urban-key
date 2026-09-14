import { useRef } from "react";
import useRevealed from "./useRevealed";

/**
 * Révélation au défilement : le contenu monte en fondu.
 * `as` permet de conserver une sémantique correcte (li, figure, etc.).
 *
 * L'animation est une transition CSS, pas une animation JavaScript : le
 * navigateur la joue sur la carte graphique sans repeindre le bloc à chaque
 * image. Tout est réglé par variables (voir `.reveal` dans base.css).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 34,
  duration = 1.05,
  className = "",
  as: Tag = "div",
  amount = 0.3,
  style,
  ...rest
}) {
  const ref = useRef(null);
  const revealed = useRevealed(ref, amount);

  return (
    <Tag
      ref={ref}
      className={`reveal ${revealed ? "is-in" : ""} ${className}`}
      style={{
        "--reveal-y": `${y}px`,
        "--reveal-delay": `${delay}s`,
        "--reveal-duration": `${duration}s`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
