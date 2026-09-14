/**
 * Le logotype fourni par la marque, en PNG transparent.
 * `variant="key"` n'affiche que la clé ornementale seule.
 */
const BRAND = `${import.meta.env.BASE_URL}brand/`;

const ASSETS = {
  full: { src: `${BRAND}wordmark.png`, width: 1600, height: 201, alt: "Urban Key" },
  key: { src: `${BRAND}key.png`, width: 760, height: 253, alt: "" },
};

export default function Wordmark({ variant = "full", className = "", ...rest }) {
  const a = ASSETS[variant] ?? ASSETS.full;
  return (
    <img
      className={`wordmark wordmark--${variant} ${className}`}
      src={a.src}
      width={a.width}
      height={a.height}
      alt={a.alt}
      aria-hidden={a.alt ? undefined : true}
      draggable="false"
      {...rest}
    />
  );
}
