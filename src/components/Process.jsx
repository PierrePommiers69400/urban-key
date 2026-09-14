import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { processSteps } from "../data/content";
import SplitText from "./ui/SplitText";
import Reveal from "./ui/Reveal";
import "./process.css";

function Step({ step, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "start 35%"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.28, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [26, 0]);
  const dotScale = useTransform(scrollYProgress, [0.4, 1], [0.4, 1]);

  return (
    <motion.li className="step" ref={ref} style={{ opacity, x }}>
      <motion.span className="step__dot" style={{ scale: dotScale }} />
      <span className="step__index">{step.index}</span>
      <div className="step__body">
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        <span className="step__aside">{step.aside}</span>
      </div>
      <span className="step__ordinal" aria-hidden="true">
        {String(i + 1).padStart(2, "0")}
      </span>
    </motion.li>
  );
}

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 70%"] });
  const line = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });

  return (
    <section className="section process" id="methode" ref={ref}>
      <div className="shell process__grid">
        <div className="process__aside">
          <div className="process__sticky">
            <Reveal>
              <span className="eyebrow">La méthode</span>
            </Reveal>
            <SplitText
              as="h2"
              className="process__title"
              lines={[["Dix", "jours"], ["de", { text: "la visite", gold: true, italic: true }], ["au", "premier", "séjour."]]}
            />
            <Reveal delay={0.15}>
              <p className="lead process__lead">
                Un protocole clair, du premier appel à la première réservation.
                Vous signez, nous orchestrons.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <a className="btn btn--ghost process__cta" href="#contact">
                Réserver une visite
                <span className="btn__arrow">→</span>
              </a>
            </Reveal>
          </div>
        </div>

        <div className="process__timeline">
          <div className="process__rail">
            <motion.span className="process__rail-fill" style={{ scaleY: line }} />
          </div>
          <ol className="process__steps">
            {processSteps.map((s, i) => (
              <Step key={s.index} step={s} i={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
