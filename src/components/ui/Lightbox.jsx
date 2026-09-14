import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { pad, photoSrc } from "./photos";
import "./lightbox.css";

const EXIT = 380;

/**
 * Visionneuse plein écran : la galerie recadre ses photos pour tenir son
 * rythme, ici on les rend entières. Flèches du clavier, Échap pour sortir.
 *
 * Comme les mentions légales, la fermeture tient à une minuterie et non à la
 * fin d'une animation : un rendu gelé ne doit pas laisser un voile sur la page.
 */
export default function Lightbox({ photos, index, onChange, onClose }) {
  const open = index !== null;
  const [closing, setClosing] = useState(false);
  const closeRef = useRef(null);
  const count = photos.length;

  const requestClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, EXIT);
  }, [onClose]);

  const go = useCallback(
    (step) => onChange((i) => (i + step + count) % count),
    [onChange, count],
  );

  useEffect(() => {
    if (!open) return undefined;
    const trigger = document.activeElement;
    document.body.classList.add("is-locked");
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") requestClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
      trigger?.focus?.({ preventScroll: true });
    };
  }, [open, go, requestClose]);

  if (!open) return null;
  const photo = photos[index];

  return (
    <motion.div
      className="lightbox on-navy"
      role="dialog"
      aria-modal="true"
      aria-label="Photo agrandie"
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: EXIT / 1000 }}
      style={{ pointerEvents: closing ? "none" : "auto" }}
      onClick={requestClose}
    >
      <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
        <motion.img
          key={photo.src}
          className="lightbox__img"
          src={photoSrc(photo)}
          alt={photo.alt}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <figcaption className="lightbox__caption">
          <span className="lightbox__count">
            {pad(index + 1)} <span>/ {pad(count)}</span>
          </span>
          <span className="lightbox__room">{photo.room}</span>
        </figcaption>
      </figure>

      <button
        type="button"
        className="lightbox__arrow lightbox__arrow--prev"
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        aria-label="Photo précédente"
      >
        ←
      </button>
      <button
        type="button"
        className="lightbox__arrow lightbox__arrow--next"
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        aria-label="Photo suivante"
      >
        →
      </button>
      <button
        ref={closeRef}
        type="button"
        className="lightbox__close"
        onClick={requestClose}
        aria-label="Fermer"
      >
        <span />
        <span />
      </button>
    </motion.div>
  );
}
