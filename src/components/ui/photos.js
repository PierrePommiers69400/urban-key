/**
 * Chaque photo d'intérieur existe en deux largeurs : 600 px pour les
 * téléphones, 1000 px au-delà. `photo.src` n'en donne que la racine.
 */
export const photoSrc = (photo) => `${photo.src}-1000.webp`;

export const photoSrcSet = (photo) =>
  `${photo.src}-600.webp 600w, ${photo.src}-1000.webp 1000w`;

export const pad = (n) => String(n).padStart(2, "0");
