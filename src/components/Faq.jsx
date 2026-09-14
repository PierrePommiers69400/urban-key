import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faq } from "../data/content";
import SplitText from "./ui/SplitText";
import Reveal from "./ui/Reveal";
import "./faq.css";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq">
      <div className="shell faq__grid">
        <div className="faq__aside">
          <Reveal>
            <span className="eyebrow">Questions</span>
          </Reveal>
          <SplitText
            as="h2"
            className="faq__title"
            lines={[["Ce", "que", "l'on", "nous"], [{ text: "demande", gold: true, italic: true }, "souvent."]]}
          />
          <Reveal delay={0.2}>
            <p className="lead faq__lead">
              Une interrogation qui ne figure pas ici&nbsp;? Écrivez-nous, nous répondons
              en moins de deux heures ouvrées.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a className="btn btn--ghost" href="#contact">
              Poser ma question
              <span className="btn__arrow">→</span>
            </a>
          </Reveal>
        </div>

        <ul className="faq__list">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={item.q} delay={i * 0.06} className={`faq__item ${isOpen ? "is-open" : ""}`}>
                <button
                  className="faq__question"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="faq__q-index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="faq__q-text">{item.q}</span>
                  <span className="faq__toggle" aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq__answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.35 } }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
