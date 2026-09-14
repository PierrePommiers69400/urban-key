/**
 * Sceau circulaire : un texte en rotation lente autour d'une serrure gravée.
 *
 * Le cœur était la photographie de la clé de marque. À soixante pixels, sa
 * ferronnerie se réduisait à une tache : un poinçon se grave, il ne se
 * photographie pas. Une serrure, elle, tient à n'importe quelle taille — et
 * elle est symétrique, ce que la clé posée en diagonale n'était pas.
 */
export default function RotaryBadge({
  text = "URBAN KEY · CONCIERGERIE · FRANCE · ",
  size = 150,
  duration = 26,
  className = "",
}) {
  return (
    <div className={`rotary ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      {/* Rotation en CSS sur une boîte HTML : le compositeur la joue seul.
          Posée sur le SVG lui-même, elle forçait à le repeindre à chaque image. */}
      <div className="rotary__spin" style={{ animationDuration: `${duration}s` }}>
        <svg className="rotary__ring" viewBox="0 0 200 200">
          <defs>
            <path id="rotary-path" d="M100 100m-72 0a72 72 0 1 1 144 0a72 72 0 1 1-144 0" fill="none" />
          </defs>
          <circle cx="100" cy="100" r="93" fill="none" stroke="rgba(196,158,100,.5)" />
          <circle cx="100" cy="100" r="48" fill="none" stroke="rgba(196,158,100,.32)" />
          <text fill="currentColor">
            {/* textLength cale les deux répétitions exactement sur la circonférence :
                sans cela, la fin du texte chevauche son début. */}
            <textPath href="#rotary-path" startOffset="0%" textLength="452" lengthAdjust="spacing">
              {text.repeat(2)}
            </textPath>
          </text>
        </svg>
      </div>

      <svg className="rotary__core" viewBox="0 0 48 52" fill="currentColor">
        <circle cx="24" cy="18" r="9" />
        {/* Le haut du pêne épouse la corde du cercle : sans cela, l'union des
            deux formes laisse une encoche visible de part et d'autre. */}
        <path d="M18.9 25.4 L15 43 h18 L29.1 25.4 Z" />
      </svg>
    </div>
  );
}
