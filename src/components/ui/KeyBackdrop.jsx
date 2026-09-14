import { Component, lazy, Suspense, useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Wordmark from "./Wordmark";
import "./key-backdrop.css";

// three.js part dans son propre morceau de code, chargé après le premier écran.
const KeyScene = lazy(() => import("../three/KeyScene"));

/** Scène en échec — pilote capricieux, modèle introuvable — on garde la clé à plat. */
class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Passer à `false` coupe la scène 3D : la clé à plat prend le relais partout. */
const ENABLE_3D = true;

const canRender3D = () => {
  try {
    if (!ENABLE_3D) return false;
    if (window.matchMedia("(max-width: 860px)").matches) return false;
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && canvas.getContext("webgl2"));
  } catch {
    return false;
  }
};

/**
 * La clé en décor du premier écran : fixée à la fenêtre, elle reste avec le
 * visiteur pendant qu'il descend, pivote au défilement et dérive sous la
 * souris. Les sections suivantes, opaques, viennent la recouvrir.
 *
 * `progress` et `pointer` sont des refs partagées avec la scène : rien ne
 * redéclenche de rendu React à chaque image.
 */
export default function KeyBackdrop({ progress, pointer, opacity }) {
  const reduced = useReducedMotion();
  const [capable] = useState(() => canRender3D());
  const armed = capable && !reduced;

  // La clé à plat tient le cadre jusqu'à la première image de la scène,
  // puis s'efface en fondu : pas de saut, pas de trou.
  const [live, setLive] = useState(false);
  const onReady = useCallback(() => setLive(true), []);

  // On ne monte la scène qu'une fois le premier écran peint, pour ne pas
  // disputer la bande passante aux polices et à la photographie du héros.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!armed) return undefined;
    const start = () => setMounted(true);
    const id = window.setTimeout(start, 600);
    return () => window.clearTimeout(id);
  }, [armed]);

  useEffect(() => {
    if (!mounted) return;
    fetch(`${import.meta.env.BASE_URL}brand/key.glb`, { cache: "force-cache" }).catch(() => {});
  }, [mounted]);

  useEffect(() => {
    if (!armed) return undefined;
    const onMove = (e) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [armed, pointer]);

  return (
    <motion.div className="keyback" style={{ opacity }} aria-hidden="true">
      <Wordmark variant="key" className={`keyback__still ${live ? "is-faded" : ""}`} />
      {mounted && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <div className={`keyback__scene ${live ? "is-live" : ""}`}>
              <KeyScene progress={progress} pointer={pointer} onReady={onReady} />
            </div>
          </Suspense>
        </SceneBoundary>
      )}
    </motion.div>
  );
}
