import { Fragment, useRef } from "react";
import useRevealed from "./useRevealed";

/**
 * Titre découpé en lignes puis en mots, chaque ligne masquée par overflow.
 * On passe un tableau de lignes ; un mot peut porter un style (italique, or).
 *
 *   <SplitText lines={[["L'art de"], [{ text: "louer", gold: true }]]} />
 *
 * L'observation se fait sur le titre entier : les mots, décalés hors de leur
 * masque, ne sont jamais « visibles » au sens d'IntersectionObserver.
 *
 * Les mots sont séparés par une vraie espace et non par une marge : le titre
 * doit se lire « Vous gardez » à la copie, au lecteur d'écran et au robot
 * d'indexation, pas seulement à l'œil.
 *
 * La montée des mots est une transition CSS (voir `.split__word`) : une
 * centaine de mots animés en JavaScript repeignaient le titre à chaque image.
 */
export default function SplitText({
  lines,
  className = "",
  as: Tag = "h2",
  delay = 0,
  stagger = 0.055,
  duration = 1.15,
  animate = "inView",
}) {
  const ref = useRef(null);
  const inView = useRevealed(ref, 0.25);
  // « none » : le titre est là dès la première image, sans état de départ.
  const instant = animate === "none";
  const active = animate === "mount" || instant ? true : inView;

  // Index global de chaque mot, calculé avant le rendu : il pilote le décalage.
  const offsets = [];
  lines.reduce((total, line) => {
    offsets.push(total);
    return total + (Array.isArray(line) ? line.length : 1);
  }, 0);

  return (
    <Tag
      className={`split ${instant ? "is-static" : active ? "is-in" : ""} ${className}`}
      ref={ref}
      style={{ "--split-duration": `${duration}s` }}
    >
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 ? "\n" : null}
          <span className="split__line">
            {(Array.isArray(line) ? line : [line]).map((raw, wi, words) => {
              const word = typeof raw === "string" ? { text: raw } : raw;
              const i = offsets[li] + wi;
              return (
                <Fragment key={`${li}-${wi}`}>
                  <span className="split__mask">
                    <span
                      className={[
                        "split__word",
                        word.gold ? "accent-text" : "",
                        word.italic ? "serif-italic" : "",
                        word.className || "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={instant ? undefined : { transitionDelay: `${delay + i * stagger}s` }}
                    >
                      {word.text}
                    </span>
                  </span>
                  {wi < words.length - 1 ? " " : null}
                </Fragment>
              );
            })}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
