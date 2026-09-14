import { useEffect, useState } from "react";
import { useInView } from "motion/react";

/**
 * Déclencheur d'apparition robuste.
 *
 * L'IntersectionObserver ne se réveille pas toujours — arrivée directe sur une
 * ancre, rechargement avec position restaurée, onglet ralenti par le
 * navigateur. On le double donc d'une vérification géométrique : quelques
 * relevés juste après le montage, puis à chaque défilement tant que l'élément
 * n'a pas été vu. Tout s'arrête dès la première apparition.
 *
 * `reach` s'exprime en hauteurs d'écran : au-delà de 1, l'élément est
 * considéré comme atteint avant même d'entrer dans le champ — utile pour
 * lancer un chargement lourd en avance.
 */
const CHECKPOINTS = [0, 260, 900];

/*
 * Une seule écoute du défilement et une seule image d'animation pour toute la
 * page. Chaque élément en attente s'y inscrit : en haut de page, ils sont une
 * cinquantaine, et chacun réclamait jusqu'ici sa propre image à chaque cran.
 */
const watchers = new Set();
let queued = 0;

const flush = () => {
  queued = 0;
  watchers.forEach((check) => check());
};

const schedule = () => {
  if (!queued) queued = requestAnimationFrame(flush);
};

function watch(check) {
  if (watchers.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  watchers.add(check);
  return () => {
    watchers.delete(check);
    if (watchers.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(queued);
      queued = 0;
    }
  };
}

export default function useRevealed(ref, amount = 0.3, reach = 0.95) {
  const inView = useInView(ref, { once: true, amount });
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (seen || inView) return undefined;

    const check = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * reach && rect.bottom > 0) setSeen(true);
    };

    const timers = CHECKPOINTS.map((delay) => setTimeout(check, delay));
    const unwatch = watch(check);

    return () => {
      timers.forEach(clearTimeout);
      unwatch();
    };
  }, [ref, reach, seen, inView]);

  return inView || seen;
}
