import { useRef, useState } from "react";
import { motion } from "motion/react";
import useRevealed from "./ui/useRevealed";
import { services } from "../data/content";
import SplitText from "./ui/SplitText";
import Reveal from "./ui/Reveal";
import Icon from "./ui/Icons";
import "./services.css";

function ServiceCard({ service, index, open, onToggle }) {
  const ref = useRef(null);
  const revealed = useRevealed(ref, 0.2);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <motion.article
      ref={ref}
      className={`service ${open ? "is-open" : ""}`}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 46 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 46 }}
      transition={{ duration: 1, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="service__spot" />
      {/* Au téléphone, la carte se replie en ligne : ce bouton la déplie. */}
      <button
        type="button"
        className="service__hit"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`service-${service.id}`}
        aria-label={service.title}
      />
      <span className="service__index">{service.index}</span>
      <div className="service__icon">
        <Icon name={service.icon} size={44} />
      </div>
      <h3 className="service__title">{service.title}</h3>
      <span className="service__plus" aria-hidden="true">
        <span />
        <span />
      </span>
      <div className="service__more" id={`service-${service.id}`}>
        <div className="service__more-inner">
          <p className="service__summary">{service.summary}</p>
          <ul className="service__details">
            {service.details.map((d) => (
              <li key={d}>
                <span className="service__bullet" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <span className="service__corner service__corner--tl" />
      <span className="service__corner service__corner--br" />
    </motion.article>
  );
}

export default function Services() {
  const [open, setOpen] = useState(-1);

  return (
    <section className="section services" id="services">
      <div className="shell">
        <header className="services__head">
          <div>
            <Reveal>
              <span className="eyebrow">Nos services</span>
            </Reveal>
            <SplitText
              as="h2"
              className="services__title"
              lines={[["Tout", "ce", "qu'un", "propriétaire"], [{ text: "n'a plus", gold: true, italic: true }, "à faire."]]}
            />
          </div>
          <Reveal delay={0.2} className="services__note">
            <p>
              Six métiers réunis sous un même toit, coordonnés par un gestionnaire unique.
              Aucun sous-traitant fantôme, aucune ligne de frais surprise.
            </p>
            <a className="link-underline services__note-link" href="#formules">
              Voir les formules →
            </a>
          </Reveal>
        </header>

        <div className="services__grid">
          {services.map((s, i) => (
            <ServiceCard
              key={s.id}
              service={s}
              index={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
