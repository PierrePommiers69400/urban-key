import { useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Manifesto from "./components/Manifesto";
import Services from "./components/Services";
import Stats from "./components/Stats";
import Process from "./components/Process";
import Pricing from "./components/Pricing";
import Gallery from "./components/Gallery";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  // Lien profond : on recale la position une fois les polices chargées,
  // sinon la mise en page bouge encore sous l'ancre visée.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    // Dès que le visiteur fait défiler lui-même, on ne touche plus à rien :
    // le recalage le ramènerait en arrière, en plein geste.
    let moved = false;
    const stop = () => (moved = true);
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"];
    inputs.forEach((type) => window.addEventListener(type, stop, { once: true, passive: true }));
    const align = () => {
      if (!moved) target.scrollIntoView({ behavior: "instant", block: "start" });
    };
    const frame = requestAnimationFrame(align);
    document.fonts?.ready.then(align);
    return () => {
      cancelAnimationFrame(frame);
      inputs.forEach((type) => window.removeEventListener(type, stop));
    };
  }, []);

  // Pendant le défilement, le contenu glisse sous une souris immobile : les
  // effets de survol se déclenchaient au passage (cartes qui montent, fonds
  // qui s'inversent) et donnaient à la page un air de sauter. On les suspend
  // le temps du geste ; ils reviennent dès qu'on s'arrête.
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return undefined;
    const root = document.documentElement;
    let timer = 0;
    const onScroll = () => {
      if (timer) clearTimeout(timer);
      else root.classList.add("is-scrolling");
      timer = setTimeout(() => {
        root.classList.remove("is-scrolling");
        timer = 0;
      }, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
      root.classList.remove("is-scrolling");
    };
  }, []);

  return (
    <>
      <Nav />

      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Services />
        <Stats />
        <Process />
        <Pricing />
        <Gallery />
        {/* Témoignages retirés tant qu'il n'y a pas de vrais avis : voir le README. */}
        <Faq />
        <Contact />
      </main>

      <Footer />

      <div className="grain" aria-hidden="true" />
    </>
  );
}
