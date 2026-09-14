import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const MODEL = `${import.meta.env.BASE_URL}brand/key.glb`;

/**
 * La scène est pilotée directement, sans react-three-fiber.
 *
 * Celui-ci n'initialise son moteur qu'après avoir mesuré son conteneur, via un
 * ResizeObserver : quand la mesure tarde ou n'arrive pas, la toile reste à sa
 * taille par défaut et rien ne se dessine. Ici, le décor couvre exactement la
 * fenêtre — on connaît donc sa taille sans avoir à la mesurer.
 *
 * `progress` et `pointer` sont des refs partagées avec React : la boucle les
 * lit à chaque image sans déclencher le moindre rendu de composant.
 */
export default function KeyScene({ progress, pointer, onReady }) {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return undefined;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      // Le décor est doux et sous-échantillonné : l'antialiasing n'apporterait rien.
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.36, 0.55));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    Object.assign(renderer.domElement.style, {
      display: "block",
      width: "100%",
      height: "100%",
    });
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    // Un studio en cube : l'or reçoit ses reflets sans charger la moindre HDRI.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xffeecb, 1.5);
    key.position.set(3, 4, 5);
    const fill = new THREE.DirectionalLight(0x9ab6ff, 0.55);
    fill.position.set(-4, -1, -3);
    const warm = new THREE.PointLight(0xf0cf95, 1.1, 12);
    warm.position.set(0, -2, 3);
    scene.add(new THREE.AmbientLight(0xffffff, 0.18), key, fill, warm);

    // Deux groupes : l'un dérive avec la souris, l'autre tourne sur la tige.
    const drift = new THREE.Group();
    const shaft = new THREE.Group();
    drift.add(shaft);
    scene.add(drift);

    const fit = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    fit();
    window.addEventListener("resize", fit, { passive: true });
    window.addEventListener("orientationchange", fit, { passive: true });

    let shaftAxis = "x";
    let disposed = false;

    new GLTFLoader().load(
      MODEL,
      (gltf) => {
        if (disposed) return;
        const o = gltf.scene;
        const box = new THREE.Box3().setFromObject(o);
        const size = box.getSize(new THREE.Vector3());
        const s = 4.2 / Math.max(size.x, size.y, size.z);
        o.scale.setScalar(s);
        // La translation d'un Object3D s'applique après sa mise à l'échelle :
        // recentrer avec le vecteur brut laissait la clé décalée d'un quart
        // d'écran, et toute position calculée ensuite devenait un tâtonnement.
        o.position.copy(box.getCenter(new THREE.Vector3())).multiplyScalar(-s);
        shaftAxis = size.x >= size.y && size.x >= size.z ? "x" : size.y >= size.z ? "y" : "z";
        o.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.envMapIntensity = 1.05;
            // La rugosité maximale renvoyait la moyenne du studio — un gris
            // crème. En la repolissant, l'or retrouve ses reflets et sa teinte.
            child.material.roughness = 0.34;
            child.material.color.set("#e0ac57");
            child.material.needsUpdate = true;
          }
        });
        shaft.add(o);
        renderer.render(scene, camera);
        onReady?.();
      },
      undefined,
      () => {},
    );

    // Cible et valeur courante : l'écart entre les deux fait toute la souplesse.
    const aim = { y: 0.55, rx: 0, ry: 0, rz: 0 };
    const clock = new THREE.Clock();
    let frame = 0;

    const loop = () => {
      frame = requestAnimationFrame(loop);
      const delta = Math.min(clock.getDelta(), 0.1);
      const t = clock.elapsedTime;
      const p = progress.current;

      /*
       * Passé le premier écran, le décor est déjà à opacité nulle : continuer
       * à le peindre coûtait une image WebGL plein écran soixante fois par
       * seconde pour rien, sur toute la longueur de la page. On s'arrête —
       * sans risque de clignotement, puisqu'il n'y a plus rien à voir.
       */
      if (p > 0.82) return;
      const px = pointer.current.x;
      const py = pointer.current.y;

      /*
       * Deux gestes, deux effets, sans recouvrement :
       *  — la souris ne fait que basculer la clé dans le plan de l'écran ;
       *  — le défilement seul la fait descendre et pivoter sur son axe.
       * L'abscisse, elle, ne bouge jamais. Elle se mesure en demi-largeurs
       * visibles et non en unités fixes : sur un écran étroit, une constante
       * aurait poussé la clé hors du cadre.
       */
      const half = 2.073 * camera.aspect;
      const target = {
        y: 0.55 - p * 1.6,
        rx: py * 0.2 + 0.05,
        ry: -0.35 + p * 0.5,
        rz: px * 0.32 - py * 0.14,
      };

      // Amortissement long : le mouvement traîne derrière le curseur.
      const k = 1 - Math.pow(0.06, delta);
      aim.y += (target.y - aim.y) * k;
      aim.rx += (target.rx - aim.rx) * k;
      aim.ry += (target.ry - aim.ry) * k;
      aim.rz += (target.rz - aim.rz) * k;

      drift.position.set(half * 0.32, aim.y + Math.sin(t * 0.4) * 0.12, 0);
      drift.rotation.set(aim.rx, aim.ry, aim.rz + Math.sin(t * 0.27) * 0.05);
      /*
       * Un tour complet ferait passer la clé par la tranche, où elle se
       * réduit à un trait. On la fait donc osciller au repos, et c'est le
       * défilement qui lui donne son vrai quart de tour.
       */
      shaft.rotation[shaftAxis] = Math.sin(t * 0.16) * 0.38 + p * 1.5;

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
      scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry?.dispose();
          const materials = Array.isArray(o.material) ? o.material : [o.material];
          materials.forEach((m) => {
            Object.values(m ?? {}).forEach((v) => v?.isTexture && v.dispose());
            m?.dispose();
          });
        }
      });
      envTarget.texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress, pointer, onReady]);

  return <div ref={host} className="keyscene" />;
}
