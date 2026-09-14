import { useEffect } from "react";
import Cursor from "./components/Cursor";
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
    const align = () =>
      target.scrollIntoView({ behavior: "instant", block: "start" });
    const frame = requestAnimationFrame(align);
    document.fonts?.ready.then(align);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Cursor />
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
