import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { interiors } from "../data/content";
import SplitText from "./ui/SplitText";
import Reveal from "./ui/Reveal";
import Magnetic from "./ui/Magnetic";
import Lightbox from "./ui/Lightbox";
import useRevealed from "./ui/useRevealed";
import { pad, photoSrc, photoSrcSet } from "./ui/photos";
import "./gallery.css";

const PIN_QUERY = "(min-width: 900px)";

/**
 * Galerie épinglée seulement sur grand écran, et si le visiteur accepte le
 * mouvement : au doigt, un défilement horizontal natif est plus honnête
 * qu'une page qui détourne le geste vertical.
 */
function usePinned() {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(() => window.matchMedia(PIN_QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return wide && !reduced;
}

function Shot({ photo, i, drift, eager, onOpen }) {
  return (
    <figure className={`shot shot--${photo.shape}`}>
      <button
        type="button"
        className="shot__frame"
        onClick={() => onOpen(i)}
      >
        <span className="sr-only">Agrandir : </span>
        <motion.img
          className="shot__img"
          src={photoSrc(photo)}
          srcSet={photoSrcSet(photo)}
          sizes="(max-width: 900px) 80vw, 40vw"
          alt={photo.alt}
          style={{ x: drift, objectPosition: photo.focus }}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable="false"
        />
      </button>
      <figcaption className="shot__caption">
        <span className="shot__index">{pad(i + 1)}</span>
        <span className="shot__room">{photo.room}</span>
      </figcaption>
    </figure>
  );
}

export default function Gallery() {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const trackRef = useRef(null);
  const pinned = usePinned();
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  // Décalées sur le rail, les photos sont « hors écran » pour le navigateur
  // jusqu'au dernier moment : on les charge dès que la section approche,
  // plutôt que de les décoder en plein glissement.
  const near = useRevealed(sectionRef, 0, 2.5);

  // La course horizontale = ce qui dépasse de l'écran. La hauteur de la
  // section en découle : un pixel de défilement, un pixel de glissement.
  useLayoutEffect(() => {
    if (!pinned) return undefined;
    const rail = railRef.current;
    const measure = () =>
      setDistance(Math.max(0, rail.scrollWidth - document.documentElement.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const { scrollXProgress } = useScroll({ container: trackRef });
  const progress = pinned ? scrollYProgress : scrollXProgress;

  const railX = useTransform(scrollYProgress, (v) => -v * distance);
  const ghostX = useTransform(scrollYProgress, (v) => -v * distance * 0.3);
  // Chaque photo glisse un peu dans son cadre, à contre-sens : une fenêtre.
  const drift = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  // Au clavier, le navigateur ferait défiler le cadre épinglé pour montrer
  // l'élément ciblé et désaxerait le rail. On ramène plutôt la page à la
  // hauteur où cet élément passe à l'écran.
  const onRailFocus = (e) => {
    if (!pinned) return;
    const block = e.target.closest(".shot, .gallery__outro");
    const pin = block?.offsetParent;
    if (!pin) return;
    pin.scrollLeft = 0;
    requestAnimationFrame(() => (pin.scrollLeft = 0));
    const shift = Math.min(distance, Math.max(0, block.offsetLeft - window.innerWidth * 0.3));
    const top = sectionRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + shift, behavior: "instant" });
  };

  useMotionValueEvent(progress, "change", (v) => {
    const last = interiors.length - 1;
    setActive(Math.min(last, Math.max(0, Math.round(v * last))));
  });

  return (
    <section
      className={`gallery on-navy ${pinned ? "is-pinned" : ""}`}
      id="adresses"
      ref={sectionRef}
      data-nav-theme="dark"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="gallery__pin">
        <motion.span
          className="gallery__ghost"
          style={pinned ? { x: ghostX } : undefined}
          aria-hidden="true"
        >
          Intérieurs
        </motion.span>

        <motion.div
          className="gallery__rail"
          ref={railRef}
          style={pinned ? { x: railX } : undefined}
          onFocus={onRailFocus}
        >
          <header className="gallery__intro">
            <Reveal>
              <span className="eyebrow">Nos intérieurs</span>
            </Reveal>
            <SplitText
              as="h2"
              className="gallery__title"
              lines={[
                ["Des", "lieux", "que"],
                ["l'on", "tient"],
                [{ text: "comme", gold: true, italic: true }, { text: "les nôtres.", gold: true, italic: true }],
              ]}
            />
            <Reveal delay={0.15}>
              <p className="gallery__lead">
                Chambres, cuisine, salon, jusqu'à la cave voûtée : des pièces des logements
                que nous gérons aujourd'hui. Chacun est préparé, photographié et entretenu
                par les mêmes mains.
              </p>
            </Reveal>
            <Reveal delay={0.25} className="gallery__hint">
              <span>{pinned ? "Continuez de défiler" : "Faites glisser"}</span>
              <span className="gallery__hint-line" />
            </Reveal>
          </header>

          <div className="gallery__track" ref={trackRef}>
            {interiors.map((photo, i) => (
              <Shot
                key={photo.id}
                photo={photo}
                i={i}
                drift={pinned ? drift : undefined}
                eager={near}
                onOpen={setOpen}
              />
            ))}
          </div>

          <aside className="gallery__outro">
            <p className="gallery__outro-text">
              Et le vôtre,
              <br />
              <em className="accent-text">bientôt ici&nbsp;?</em>
            </p>
            <Magnetic strength={0.28}>
              <a className="btn" href="#contact">
                Estimer mes revenus
                <span className="btn__arrow">→</span>
              </a>
            </Magnetic>
          </aside>
        </motion.div>

        <div className="gallery__foot" aria-hidden="true">
          <span className="gallery__count">
            {pad(active + 1)} <span>/ {pad(interiors.length)}</span>
          </span>
          <div className="gallery__bar">
            <motion.span style={{ scaleX: progress }} />
          </div>
          <span className="gallery__room">{interiors[active].room}</span>
        </div>
      </div>

      <Lightbox photos={interiors} index={open} onChange={setOpen} onClose={close} />
    </section>
  );
}
