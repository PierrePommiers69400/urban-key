import { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { brand, stats } from "../data/content";
import SplitText from "./ui/SplitText";
import Magnetic from "./ui/Magnetic";
import KeyBackdrop from "./ui/KeyBackdrop";
import "./hero.css";

// Une seule source de vérité : les trois premiers engagements de content.js.
const highlights = stats.slice(0, 3).map((s) => ({
  value: `${s.value.toLocaleString("fr-FR")}${s.suffix}`,
  label: s.label,
}));

export default function Hero() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Le décor s'efface à mesure que le premier écran s'en va.
  const keyOpacity = useTransform(scrollYProgress, [0, 0.75], [0.66, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Partagés avec la scène 3D sans repasser par le rendu React.
  const keyProgress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    keyProgress.current = v;
  });

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero__bg" aria-hidden="true" />
      <KeyBackdrop
        progress={keyProgress}
        pointer={pointer}
        opacity={keyOpacity}
      />

      <div className="shell hero__layout">
        <motion.div
          className="hero__copy"
          style={reduced ? undefined : { y: copyY, opacity: fade }}
        >
          {/* Le titre et son surtitre ne s'animent pas : c'est la première
              chose qu'on doit lire, elle est là dès la première image. */}
          <span className="eyebrow">Conciergerie privée — {brand.area}</span>

          <SplitText
            as="h1"
            className="hero__title"
            animate="none"
            lines={[
              ["Vous", "gardez"],
              ["la", { text: "clé.", gold: true, italic: true }],
              ["Nous", "gérons", "le", "reste."],
            ]}
          />

          <motion.p
            className="lead hero__lead"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Annonces optimisées, entrées et sorties autonomes, ménage, cautions
            et litiges : nous prenons votre logement en main de bout en bout,
            partout en France. Vous n'en gardez que les revenus.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Magnetic strength={0.28}>
              <a className="btn" href="#contact">
                Estimer mes revenus
                <span className="btn__arrow">→</span>
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                className="btn btn--ghost"
                href="#manifeste"
              >
                Découvrir la maison
              </a>
            </Magnetic>
          </motion.div>

          <motion.ul
            className="hero__highlights"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {highlights.map((h) => (
              <li key={h.label}>
                <span className="hero__hl-value">{h.value}</span>
                <span className="hero__hl-label">{h.label}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <motion.a
        className="hero__scroll"
        href="#manifeste"
        aria-label="Faire défiler"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.45 }}
      >
        <span>Défiler</span>
        <span className="hero__scroll-line" />
      </motion.a>
    </section>
  );
}
