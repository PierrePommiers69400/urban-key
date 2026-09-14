import { useRef } from "react";
import { plans } from "../data/content";
import SplitText from "./ui/SplitText";
import Reveal from "./ui/Reveal";
import useRevealed from "./ui/useRevealed";
import "./pricing.css";

function Plan({ plan, i }) {
  const ref = useRef(null);
  const revealed = useRevealed(ref, 0.2);

  return (
    <article
      ref={ref}
      className={`plan reveal ${revealed ? "is-in" : ""} ${plan.featured ? "plan--featured on-navy" : ""}`}
      style={{ "--reveal-y": "54px", "--reveal-delay": `${i * 0.12}s` }}
    >
      {plan.featured && <span className="plan__flag">La plus choisie</span>}
      <header className="plan__head">
        <h3 className="plan__name">{plan.name}</h3>
        <p className="plan__pitch">{plan.pitch}</p>
      </header>

      <div className="plan__rate">
        <span className="plan__rate-value">{plan.rate}</span>
        <span className="plan__rate-note">{plan.rateNote}</span>
      </div>

      <ul className="plan__features">
        {plan.features.map((f, fi) => (
          <li key={f} style={{ transitionDelay: `${0.3 + i * 0.12 + fi * 0.07}s` }}>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2.5 8.4l3.6 3.6L14 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <a className={`btn ${plan.featured ? "" : "btn--ghost"} plan__cta`} href="#contact">
        {plan.featured ? "Demander une estimation" : "Nous écrire"}
        <span className="btn__arrow">→</span>
      </a>
    </article>
  );
}

export default function Pricing() {
  return (
    <section className="section pricing" id="formules">
      <div className="shell">
        <header className="pricing__head">
          <div>
            <Reveal>
              <span className="eyebrow">Formules</span>
            </Reveal>
            <SplitText
              as="h2"
              className="pricing__title"
              lines={[["Un", "barème"], [{ text: "clair,", gold: true, italic: true }], ["tout", "est", "annoncé."]]}
            />
          </div>
          <Reveal delay={0.15} className="pricing__note">
            <p>
              Le taux dépend de ce que votre logement rapporte dans le mois, et s'applique à
              l'ensemble de ces revenus : un mois à 1&nbsp;000&nbsp;€ relève du deuxième palier, soit
              18&nbsp;%, 180&nbsp;€. À l'entrée, des frais de mise en service couvrent l'inventaire,
              l'équipement d'accès autonome et la préparation du bien. Mandat d'un an, le
              temps qu'une saison complète s'installe.
            </p>
          </Reveal>
        </header>

        <div className="pricing__grid">
          {plans.map((plan, i) => (
            <Plan key={plan.id} plan={plan} i={i} />
          ))}
        </div>
        <p className="pricing__swipe" aria-hidden="true">
          Glissez pour comparer <span>→</span>
        </p>
      </div>
    </section>
  );
}
