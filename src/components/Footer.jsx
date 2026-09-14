import { useRef, useState } from "react";
import { brand, navLinks, services } from "../data/content";
import Wordmark from "./ui/Wordmark";
import Magnetic from "./ui/Magnetic";
import Reveal from "./ui/Reveal";
import LegalDialog from "./LegalDialog";
import useRevealed from "./ui/useRevealed";
import "./footer.css";

const year = new Date().getFullYear();

export default function Footer() {
  const markRef = useRef(null);
  const [legalDoc, setLegalDoc] = useState(null);
  const markRevealed = useRevealed(markRef, 0.25);

  return (
    <footer className="footer on-navy" data-nav-theme="dark">
      <div className="shell footer__inner">
        <div className="footer__top">
          <Reveal className="footer__claim">
            <p>
              Une clé,
              <br />
              <span className="serif-italic accent-text">mille attentions.</span>
            </p>
          </Reveal>
          <Magnetic strength={0.3} className="footer__totop-wrap">
            <a className="footer__totop" href="#top" aria-label="Revenir en haut">
              <span className="footer__totop-arrow">↑</span>
              <span className="footer__totop-label">Haut de page</span>
            </a>
          </Magnetic>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <span className="footer__col-title">Navigation</span>
            <ul>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a className="link-underline" href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <span className="footer__col-title">Services</span>
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  <a className="link-underline" href="#services">{s.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <span className="footer__col-title">Maison</span>
            <ul>
              <li>{brand.address}</li>
              <li>{brand.hours}</li>
              <li>
                <a className="link-underline" href={brand.phoneHref}>{brand.phone}</a>
              </li>
              <li>
                <a className="link-underline" href={`mailto:${brand.email}`}>{brand.email}</a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <span className="footer__col-title">Suivre</span>
            <ul>
              {brand.social.map((s) => (
                <li key={s.label}>
                  <a className="link-underline" href={s.href} target="_blank" rel="noreferrer">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          ref={markRef}
          className={`footer__wordmark reveal ${markRevealed ? "is-in" : ""}`}
          style={{ "--reveal-y": "40px", "--reveal-duration": "1.4s" }}
          aria-hidden="true"
        >
          <Wordmark className="footer__logo" />
        </div>

        <div className="footer__bottom">
          <span>© {year} {brand.legalName} — {brand.address}</span>
          <div className="footer__legal">
            <button className="link-underline" onClick={() => setLegalDoc("mentions")}>
              Mentions légales
            </button>
            <button className="link-underline" onClick={() => setLegalDoc("confidentialite")}>
              Données personnelles
            </button>
          </div>
        </div>
      </div>

      <LegalDialog doc={legalDoc} onClose={() => setLegalDoc(null)} />
    </footer>
  );
}
