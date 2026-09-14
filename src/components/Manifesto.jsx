import { brand, interiors } from "../data/content";
import SplitText from "./ui/SplitText";
import Reveal from "./ui/Reveal";
import RotaryBadge from "./ui/RotaryBadge";
import { photoSrc, photoSrcSet } from "./ui/photos";
import "./manifesto.css";

const cover = interiors.find((p) => p.id === "chambre-rose");
const inset = interiors.find((p) => p.id === "cave");

const principles = [
  {
    title: "L'autonomie",
    text: "Boîte à clés ou serrure connectée : le voyageur entre seul, à toute heure. Ni rendez-vous, ni déplacement, ni trousseau qui circule.",
  },
  {
    title: "L'optimisation",
    text: "Prix et calendrier ajustés en continu selon la saison, les événements et la concurrence. C'est là que se gagnent les trente pour cent.",
  },
  {
    title: "La prise en charge",
    text: "Ménage, cautions, dégradations, litiges avec la plateforme : nous traitons. Vous n'entrez jamais dans le conflit.",
  },
];

export default function Manifesto() {
  return (
    <section className="section manifesto" id="manifeste">
      <div className="shell manifesto__grid">
        <div className="manifesto__head">
          <Reveal>
            <span className="eyebrow">La maison</span>
          </Reveal>
          <SplitText
            as="h2"
            className="manifesto__title"
            lines={[
              ["Une", "conciergerie"],
              [{ text: "d'auteur,", gold: true, italic: true }],
              ["pas", "une", "plateforme."],
            ]}
          />
          <Reveal delay={0.15}>
            <p className="lead manifesto__lead">
              Urban Key est née d'un constat simple : la location courte durée a industrialisé
              l'hospitalité. Nous prenons le chemin inverse. Frédéric et Sonia suivent
              personnellement chaque logement, où qu'il se trouve en France, et répondent
              en moins d'une heure.
            </p>
          </Reveal>

          <ol className="manifesto__principles">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={0.1 + i * 0.12} className="manifesto__principle">
                <span className="manifesto__principle-index">0{i + 1}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2} className="manifesto__signature">
            <span className="manifesto__sign-name">{brand.founders}</span>
            <span className="manifesto__sign-role">Fondateurs — {brand.legalName}</span>
          </Reveal>
        </div>

        <div className="manifesto__aside">
          <figure className="manifesto__frame">
            <div className="manifesto__arch">
              <img
                className="manifesto__photo"
                src={photoSrc(cover)}
                srcSet={photoSrcSet(cover)}
                sizes="(max-width: 1024px) 90vw, 40vw"
                alt={cover.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <span>Un intérieur Urban Key</span>
              <span className="manifesto__frame-year">MMXXVI</span>
            </figcaption>
          </figure>

          <figure className="manifesto__inset">
            <img
              src={photoSrc(inset)}
              srcSet={photoSrcSet(inset)}
              sizes="(max-width: 1024px) 40vw, 16vw"
              alt={inset.alt}
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div className="manifesto__badge">
            <RotaryBadge size={160} text="URBAN KEY · CONCIERGERIE · FRANCE · " />
          </div>

          <Reveal delay={0.25} className="manifesto__quote">
            <p>
              «&nbsp;Nous ne gérons pas des logements.
              <br />
              Nous tenons des <em>adresses</em>.&nbsp;»
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
