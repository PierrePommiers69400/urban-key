# Urban Key — site vitrine

Site statique (React + Vite) pour **Urban Key**, conciergerie et gestion locative
haut de gamme. Une seule page, six sections ancrées, entièrement autonome :
aucune image ni script externe, hormis les polices Google.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # génère dist/
npm run preview  # sert dist/ en local
npm run lint
```

`dist/` est un dossier de fichiers statiques : il se dépose tel quel sur Netlify,
Vercel, Cloudflare Pages, GitHub Pages ou n'importe quel hébergeur classique.
Aucun serveur, aucune variable d'environnement.

## Mise en ligne

Le site est hébergé gratuitement par **GitHub Pages** :
<https://pierrepommiers69400.github.io/urban-key/>

Pour publier une modification :

```bash
npm run deploy
```

La commande reconstruit le site et envoie `dist/` sur la branche `gh-pages`
(`scripts/deploy.mjs`), que GitHub sert en ligne une minute plus tard. Le code
source, lui, vit sur `main` : penser à y pousser aussi ses modifications.

Servi sous `/urban-key/`, il déclare cette base dans `vite.config.js` : en local,
`npm run dev` ouvre donc <http://localhost:5173/urban-key/>. Les chemins vers
`public/` passent par `import.meta.env.BASE_URL`, jamais par un `/` en dur.

**Brancher un nom de domaine** (urbankey.fr, par exemple) : passer `BASE` à
`"/"` dans `vite.config.js`, remplacer l'adresse du site dans `index.html`,
`public/robots.txt` et `public/sitemap.xml`, ajouter un fichier `public/CNAME`
contenant le domaine, puis déclarer ce domaine dans les réglages Pages du
dépôt et chez le registraire (enregistrements DNS indiqués par GitHub).

## Direction artistique

- **Palette** — le papier domine (`--paper`), l'encre reste discrète
  (`--black`, jamais un noir pur), et le bleu nuit de la marque (`#0B1B3A`)
  ne sert que de ponctuation. L'or est réservé aux ornements et aux blocs
  bleus : sur papier il ne porte jamais de texte.
- **Typographie** — *Newsreader* (serif éditoriale à contraste modéré, titres) et
  *Instrument Sans* (grotesque, textes). Le choix est dicté par la lisibilité :
  une didone perd ses déliés à l'écran, surtout aux corps intermédiaires.
- **Matière** — grain de papier, filets fins, tracés SVG, halos très légers.

### Une couche sémantique, deux thèmes

`src/styles/tokens.css` définit des jetons de rôle (`--bg`, `--fg`, `--fg-dim`,
`--accent`, `--line`, `--btn-bg`…). Le thème papier est celui de `:root` ; la
classe **`.on-navy`** réécrit ces mêmes jetons pour les blocs bleu nuit, de
sorte qu'aucun composant n'a besoin de savoir sur quel fond il est posé.

Les blocs bleus sont volontairement peu nombreux : le
bandeau défilant, les chiffres, le panneau de résultat du simulateur, la
formule Signature, la galerie des intérieurs, le menu plein écran et le pied
de page. Pour en ajouter un, il suffit d'apposer `on-navy` sur son conteneur.

La barre de navigation suit le fond qui défile sous elle : au-dessus d'une
section marquée `data-nav-theme="dark"` (chiffres, galerie, pied de page), elle
prend elle-même la classe `on-navy`.

## Logotype

`public/brand/` contient les fichiers fournis par la marque :
`wordmark.png` (le logotype complet) et `key.png` (la clé seule, utilisée dans
le sceau du manifeste). Les deux sont détourés sur fond transparent, ce qui
leur permet de se poser aussi bien sur le papier que sur les blocs bleu nuit.
Le composant `src/components/ui/Wordmark.jsx` est le seul point d'entrée :
changer de fichier ne demande qu'une modification là.

## La clé en trois dimensions

Le modèle 3D de la clé sert de **décor au premier écran** : fixé à la fenêtre,
il reste en place pendant qu'on descend — les sections suivantes, opaques,
viennent le recouvrir — puis s'efface au fil du défilement.

Les deux gestes ne se marchent pas dessus : **la souris ne fait que basculer la
clé dans le plan de l'écran**, autour de son propre centre ; **le défilement
seul la fait descendre** et pivoter sur son axe. Son abscisse, elle, ne bouge
jamais. Tout passe par un amortissement long, si bien que le mouvement traîne
derrière le curseur au lieu de le suivre.

`src/components/ui/KeyBackdrop.jsx` orchestre, `src/components/three/KeyScene.jsx`
rend.

**three.js est piloté directement, sans react-three-fiber.** Ce dernier
n'initialise son moteur qu'après avoir mesuré son conteneur via un
ResizeObserver ; quand cette mesure tarde ou n'arrive pas, la toile reste à sa
taille par défaut de 300 × 150, étirée sur tout l'écran, et rien ne se dessine.
Le décor couvrant exactement la fenêtre, sa taille est connue d'avance : la
mesure était une dépendance inutile. Au passage, le morceau de code 3D est
tombé de 248 à 153 Ko compressés.

Quatre précautions gardent le reste du site indemne :

- **Le code est isolé.** `KeyScene` est chargé par `lazy()`, six cents
  millisecondes après le premier écran. Le site démarre sur ≈ 122 Ko.
- **Le modèle est allégé.** `public/brand/key.glb` pèse 711 Ko au lieu des
  4,6 Mo d'origine (textures en 512 px WebP, géométrie quantifiée avec
  `@gltf-transform/cli`).
- **Le rendu est économe.** Densité de pixels bridée sous 0,7, pas
  d'antialiasing : le décor est flou, le calculer net serait du gaspillage.
- **Rien ne clignote.** La boucle de rendu ne se met jamais en veille — WebGL
  vide son tampon dès qu'on cesse de dessiner, la clé disparaîtrait à chaque
  passage. La clé à plat tient le cadre jusqu'à la première image de la scène,
  puis s'efface en fondu.

Pas de WebGL 2, écran de moins de 860 px, mouvement réduit demandé ou scène en
échec : la clé à plat reste seule, avec son flottement en CSS. La constante
`ENABLE_3D` en tête de `KeyBackdrop.jsx` coupe la 3D d'un coup.

## Modifier le contenu

Tout le texte éditorial est réuni dans **`src/data/content.js`** : coordonnées,
navigation, services, chiffres, étapes, formules, adresses, témoignages, FAQ.
Aucun composant n'a besoin d'être touché pour changer une offre ou un tarif.

### Photos des intérieurs

Les photos des logements gérés sont dans `public/interieurs/`, en WebP et en
deux largeurs (`-600.webp` pour les téléphones, `-1000.webp` sinon). Elles sont
listées dans `interiors` (`content.js`), sans distinction de bien : l'ordre de
la liste est celui de la galerie, et `shape` (`arch`, `tall`, `wide`) règle la
forme du cadre. Le manifeste en reprend deux, par leur `id`.

Pour en ajouter une, déposer les deux fichiers puis l'inscrire dans la liste.
Conversion depuis un JPEG :

```bash
cwebp -q 78 -m 6 -resize 600 0 -metadata none photo.jpg -o public/interieurs/nom-600.webp
cwebp -q 78 -m 6 -resize 1000 0 -metadata none photo.jpg -o public/interieurs/nom-1000.webp
```

### La galerie « Nos intérieurs »

`src/components/Gallery.jsx`. Sur grand écran (≥ 900 px), la section
s'épingle : la molette fait glisser les photos à l'horizontale, un pixel de
défilement pour un pixel de glissement — la hauteur de la section est calculée
d'après la longueur du rail. Au doigt, ou si le visiteur limite les animations,
elle redevient un carrousel horizontal natif. Un clic sur une photo l'ouvre en
entier dans `ui/Lightbox.jsx` (flèches du clavier, Échap).

## Témoignages

La section « Ils nous confient leurs clés » (`Testimonials.jsx`) est retirée
de la page : ses avis étaient des exemples, et publier de faux témoignages est
une pratique commerciale trompeuse. Pour la rétablir, remplacer `testimonials`
dans `content.js` par de vrais retours — avec l'accord des propriétaires — puis
réinsérer `<Testimonials />` dans `App.jsx`.

## Mentions légales & RGPD

Les deux documents obligatoires sont servis en surimpression depuis le pied de
page (`src/components/LegalDialog.jsx`) : inutile d'ajouter un routeur pour deux
textes. Leur contenu se compose à partir de `brand` et `legal` dans
`src/data/content.js` — les valeurs marquées **« À COMPLÉTER »** apparaissent
telles quelles sur le site tant qu'elles ne sont pas renseignées :

- capital social, RCS, TVA intracommunautaire ;
- l'hébergeur est renseigné (GitHub, Inc.) : à changer si le site déménage.

Il n'y a pas de CGV : le site ne vend rien en ligne, c'est le mandat de gestion
signé avec le propriétaire qui fait foi.

## Formulaire de contact

`src/components/Contact.jsx` expose une constante `FORM_ENDPOINT` :

- **`null` (par défaut)** — le formulaire prépare un courriel dans la messagerie
  du visiteur (`mailto:`) et le message de confirmation l'indique clairement.
- **URL renseignée** — les champs sont envoyés en JSON par `POST` à ce point
  d'entrée (Formspree, Netlify Forms, Basin, Formcarry…). Le message de
  confirmation devient alors « Votre demande est partie ».

## Motion

Animations pilotées par [`motion`](https://motion.dev) (successeur de
Framer Motion) :

- curseur magnétique qui s'inverse en franchissant un bloc bleu ;
- titres révélés mot à mot depuis un masque — **sauf celui du premier écran**,
  qui est peint dès la première image : c'est la phrase qu'on doit lire en
  arrivant, elle n'attend rien ;
- parallaxe de section, bandeau réactif à la vitesse de défilement,
  frise verticale progressive, compteurs, carrousel, accordéon.

`prefers-reduced-motion` est respecté partout : le curseur est désactivé et
les révélations deviennent de simples fondus.

Le déclencheur d'apparition (`src/components/ui/useRevealed.js`) double
l'`IntersectionObserver` d'une vérification géométrique au montage, pour que les
liens profonds (`/#formules`) n'affichent jamais une section vide.

## Structure

```
src/
  App.jsx                 assemblage des sections
  data/content.js         tout le contenu éditorial
  styles/                 jetons de design et styles de base
  components/
    <Section>.jsx + .css  une section = un composant + sa feuille de style
    ui/                   primitives (révélation, titres, clé SVG, curseur…)
public/
  brand/                  favicon et image de partage
  interieurs/             photos des logements (WebP, 600 et 1000 px)
```
