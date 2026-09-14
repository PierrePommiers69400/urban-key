import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { brand, navLinks } from "../data/content";
import Wordmark from "./ui/Wordmark";
import Magnetic from "./ui/Magnetic";
import "./nav.css";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [dark, setDark] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    return () => document.body.classList.remove("is-locked");
  }, [open]);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // La barre prend la couleur de ce qui défile dessous : bleu nuit sur les
  // sections marquées `data-nav-theme="dark"`, papier partout ailleurs.
  useEffect(() => {
    const sections = [...document.querySelectorAll("[data-nav-theme='dark']")];
    let frame = 0;
    const check = () => {
      frame = 0;
      const probe = document.querySelector(".nav")?.offsetHeight / 2 || 40;
      setDark(
        sections.some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= probe && r.bottom >= probe;
        }),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""} ${dark && !open ? "on-navy" : ""}`}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav__inner">
          <a className="nav__brand" href="#top" aria-label="Urban Key, retour en haut">
            <Wordmark className="nav__logo" />
          </a>

          <nav className="nav__links" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav__link ${active === link.href.slice(1) ? "is-active" : ""}`}
              >
                <span className="nav__link-index">{link.index}</span>
                <span className="nav__link-label">{link.label}</span>
              </a>
            ))}
          </nav>

          <div className="nav__actions">
            <a className="nav__phone link-underline" href={brand.phoneHref}>
              {brand.phone}
            </a>
            <Magnetic strength={0.24}>
              <a className="btn nav__cta" href="#contact">
                Estimation gratuite
                <span className="btn__arrow">→</span>
              </a>
            </Magnetic>
            <button
              className="nav__burger"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <motion.div className="nav__progress" style={{ scaleX: progress }} />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu on-navy"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu__glow" />
            <nav className="menu__links" aria-label="Menu">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="menu__link"
                  onClick={() => setOpen(false)}
                  initial={{ y: 70, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.9, delay: 0.22 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="menu__index">{link.index}</span>
                  <span className="menu__label">{link.label}</span>
                  <span className="menu__rule" />
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="menu__foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <div>
                <span className="eyebrow">Conciergerie</span>
                <p>{brand.address}</p>
                <p>{brand.hours}</p>
              </div>
              <div>
                <span className="eyebrow">Contact</span>
                <p>
                  <a className="link-underline" href={brand.phoneHref}>{brand.phone}</a>
                </p>
                <p>
                  <a className="link-underline" href={`mailto:${brand.email}`}>{brand.email}</a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
