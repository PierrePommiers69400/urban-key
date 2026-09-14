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

export default function useRevealed(ref, amount = 0.3, reach = 0.95) {
  const inView = useInView(ref, { once: true, amount });
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (seen) return undefined;

    const check = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * reach && rect.bottom > 0) setSeen(true);
    };

    // Une lecture de géométrie par image au plus : l'événement de défilement se
    // déclenche bien plus souvent que l'écran ne se rafraîchit, et chaque
    // composant en attente y allait de son propre calcul de position.
    let queued = 0;
    const onScroll = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        check();
      });
    };

    const timers = CHECKPOINTS.map((delay) => setTimeout(check, delay));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      timers.forEach(clearTimeout);
      if (queued) cancelAnimationFrame(queued);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, reach, seen]);

  return inView || seen;
}
