import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "../data/content";
import Reveal from "./ui/Reveal";
import Magnetic from "./ui/Magnetic";
import "./testimonials.css";

const variants = {
  enter: (dir) => ({ opacity: 0, y: 40 * dir, filter: "blur(6px)" }),
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: (dir) => ({ opacity: 0, y: -40 * dir, filter: "blur(6px)" }),
};

export default function Testimonials() {
  const [[index, dir], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback((step) => {
    setState(([i]) => [(i + step + testimonials.length) % testimonials.length, step]);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => go(1), 7000);
    return () => clearInterval(id);
  }, [go, paused, index]);

  const current = testimonials[index];

  return (
    <section
      className="section testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="shell testimonials__inner">
        <Reveal className="testimonials__label">
          <span className="eyebrow">Ils nous confient leurs clés</span>
        </Reveal>

        <div className="testimonials__stage">
          <span className="testimonials__quote-mark" aria-hidden="true">
            &ldquo;
          </span>
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.blockquote
              key={index}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="testimonial"
            >
              <p>{current.quote}</p>
              <footer>
                <span className="testimonial__author">{current.author}</span>
                <span className="testimonial__role">{current.role}</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="testimonials__controls">
          <div className="testimonials__dots">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                className={`testimonials__dot ${i === index ? "is-active" : ""}`}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Témoignage ${i + 1}`}
              >
                <span />
                {i === index && (
                  <motion.span
                    className="testimonials__dot-fill"
                    key={`${index}-${paused}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused ? 0.001 : 1 }}
                    transition={{ duration: paused ? 0.3 : 7, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="testimonials__arrows">
            <Magnetic strength={0.3}>
              <button onClick={() => go(-1)} aria-label="Témoignage précédent" className="testimonials__arrow">
                ←
              </button>
            </Magnetic>
            <span className="testimonials__count">
              {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
            <Magnetic strength={0.3}>
              <button onClick={() => go(1)} aria-label="Témoignage suivant" className="testimonials__arrow">
                →
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
