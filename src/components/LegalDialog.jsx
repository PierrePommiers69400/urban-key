import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { brand, legal } from "../data/content";
import "./legal.css";

/**
 * Mentions légales et politique de confidentialité, servies en surimpression :
 * le site n'a qu'une page, inutile d'y ajouter un routeur pour deux documents.
 */
const documents = {
  mentions: {
    title: "Mentions légales",
    blocks: [
      {
        heading: "Éditeur du site",
        rows: [
          ["Raison sociale", `${brand.legalName} — ${legal.form}`],
          ["Siège social", brand.address],
          ["SIRET", legal.siret],
          ["Capital social", legal.capital],
          ["RCS", legal.rcs],
          ["TVA intracommunautaire", legal.vat],
          ["Directeur de la publication", legal.director],
          ["Téléphone", brand.phone],
          ["Courriel", brand.email],
        ],
      },
      {
        heading: "Hébergement",
        rows: [["Hébergeur", legal.host]],
      },
      {
        heading: "Propriété intellectuelle",
        text: `L'ensemble des contenus de ce site — textes, logotype, mise en page — est la propriété de ${brand.legalName}, sauf mention contraire. Toute reproduction, même partielle, est soumise à autorisation écrite préalable.`,
      },
      {
        heading: "Crédits photographiques",
        text: "Photographies des logements gérés par Urban Key Conciergerie. Logotype fourni par la marque.",
      },
    ],
  },
  confidentialite: {
    title: "Données personnelles",
    blocks: [
      {
        heading: "Responsable de traitement",
        text: `${brand.legalName}, ${brand.address}. Pour toute question relative à vos données : ${brand.email}.`,
      },
      {
        heading: "Ce que nous collectons",
        text: "Uniquement ce que vous saisissez dans le formulaire de contact : nom, adresse électronique, téléphone, adresse du bien et message. Aucun autre traitement n'est réalisé à votre insu.",
      },
      {
        heading: "Pourquoi",
        text: "Pour répondre à votre demande d'estimation et, le cas échéant, préparer le contrat de gestion. La base légale est l'exécution de mesures précontractuelles prises à votre demande.",
      },
      {
        heading: "Combien de temps",
        text: "Trois ans à compter de notre dernier échange, sauf si une relation contractuelle s'est nouée entre-temps — auquel cas les durées légales de conservation comptable s'appliquent.",
      },
      {
        heading: "Qui y a accès",
        text: `Les seules personnes de ${brand.legalName} qui traitent votre demande. Vos données ne sont ni vendues, ni cédées, ni utilisées à des fins publicitaires.`,
      },
      {
        heading: "Cookies",
        text: "Ce site ne dépose aucun cookie publicitaire ni aucun outil de mesure d'audience. Le navigateur conserve seulement, le temps de votre visite, l'information que l'animation d'ouverture a déjà été jouée — un stockage strictement nécessaire, exempté de consentement.",
      },
      {
        heading: "Vos droits",
        text: `Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition. Écrivez à ${brand.email} : nous répondons sous un mois. En cas de désaccord, vous pouvez saisir la CNIL (cnil.fr).`,
      },
    ],
  },
};

const EXIT = 420;

export default function LegalDialog({ doc, onClose }) {
  const [closing, setClosing] = useState(false);

  /**
   * La fermeture est pilotée par une minuterie, pas par la fin de l'animation :
   * si le navigateur gèle le rendu, un panneau plein écran resterait devant la page.
   */
  const requestClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, EXIT);
  }, [onClose]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", Boolean(doc));
    const onKey = (e) => e.key === "Escape" && requestClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [doc, requestClose]);

  const content = doc ? documents[doc] : null;
  if (!content) return null;

  return (
    <motion.div
      className="legal on-navy"
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: EXIT / 1000 }}
      style={{ pointerEvents: closing ? "none" : "auto" }}
    >
          <motion.div
            className="legal__sheet"
            initial={{ y: 40 }}
            animate={{ y: closing ? 24 : 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="legal__head">
              <span className="eyebrow">{brand.legalName}</span>
              <h2>{content.title}</h2>
              <button className="legal__close" onClick={requestClose} aria-label="Fermer">
                <span />
                <span />
              </button>
            </header>

            <div className="legal__body">
              {content.blocks.map((block) => (
                <section key={block.heading}>
                  <h3>{block.heading}</h3>
                  {block.text && <p>{block.text}</p>}
                  {block.rows && (
                    <dl>
                      {block.rows.map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </section>
              ))}
            </div>
      </motion.div>
    </motion.div>
  );
}
