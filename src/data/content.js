/**
 * Contenu éditorial du site Urban Key.
 * Tout le texte est centralisé ici : modifier une offre, un chiffre ou
 * une question ne demande jamais de toucher aux composants.
 *
 * Ce qui reste à remplir est signalé par « À REMPLACER ».
 */

export const brand = {
  name: "Urban Key",
  legalName: "Urban Key Conciergerie",
  baseline: "Gestion et optimisation de logements en courte durée",
  area: "France entière",
  since: "2026",
  founders: "Frédéric Viruega & Sonia Chaigneau",
  phone: "06 27 30 32 51",
  phoneHref: "tel:+33627303251",
  email: "urbankey69@gmail.com",
  address: "696 rue du Creuzat, 01480 Frans",
  hours: "Conciergerie joignable 7j/7, 8h — 22h",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/01urban_key_01" },
    {
      label: "Facebook",
      href: "https://www.facebook.com/people/Urban-Key-Conciergerie/pfbid026h6Rca3LRUtL8t9eReR4Ynz98rFasVtTqyoJXdQCGqV8h5akZzvEbgX7exAD79QSl/",
    },
  ],
};

/**
 * Mentions obligatoires (LCEN art. 6-III) et informations RGPD.
 * « À COMPLÉTER » = information non fournie à ce jour.
 */
export const legal = {
  form: "SAS",
  siret: "105 310 767 00014",
  siren: "105 310 767",
  capital: "À COMPLÉTER",
  rcs: "À COMPLÉTER",
  vat: "À COMPLÉTER",
  director: "Frédéric Viruega",
  host: "GitHub, Inc. — 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis",
};

export const navLinks = [
  { label: "Maison", href: "#manifeste", index: "01" },
  { label: "Services", href: "#services", index: "02" },
  { label: "Méthode", href: "#methode", index: "03" },
  { label: "Formules", href: "#formules", index: "04" },
  { label: "Intérieurs", href: "#adresses", index: "05" },
  { label: "Contact", href: "#contact", index: "06" },
];

export const marqueeWords = [
  "Gestion complète",
  "Annonces optimisées",
  "Entrées autonomes",
  "Ménage",
  "Tarification dynamique",
  "Cautions & litiges",
  "Intervention en 1 h",
  "Partout en France",
];

export const services = [
  {
    id: "gestion",
    index: "01",
    title: "Gestion complète",
    summary:
      "Annonce, calendrier, voyageurs, ménage, cautions : nous prenons le logement en main de bout en bout. Vous n'avez plus rien à suivre.",
    details: ["Un seul interlocuteur", "Suivi des voyageurs", "Reporting propriétaire"],
    icon: "key",
  },
  {
    id: "annonces",
    index: "02",
    title: "Annonces optimisées",
    summary:
      "Titre, photos, description, prix : l'annonce est retravaillée jusqu'à ce qu'elle passe devant les autres, puis ajustée en continu.",
    details: ["Rédaction & photographies", "Diffusion multi-plateformes", "Ajustements permanents"],
    icon: "chart",
  },
  {
    id: "acces",
    index: "03",
    title: "Entrées & sorties autonomes",
    summary:
      "Boîte à clés ou serrure connectée : le voyageur entre seul, à l'heure qu'il veut. Aucun rendez-vous, aucun déplacement pour vous.",
    details: ["Arrivée 24 h/24", "Instructions envoyées avant le séjour", "Aucune remise de clé en main propre"],
    icon: "door",
  },
  {
    id: "menage",
    index: "04",
    title: "Ménage & remise en état",
    summary:
      "Un ménage complet entre chaque séjour, linge et consommables compris, contrôlé avant l'arrivée suivante.",
    details: ["Entre chaque séjour", "Linge & consommables", "Contrôle avant arrivée"],
    icon: "sparkle",
  },
  {
    id: "tarification",
    index: "05",
    title: "Planning & tarification",
    summary:
      "Prix et calendrier ajustés en continu selon la saison, les événements locaux et la concurrence. C'est là que se gagnent les 30 %.",
    details: ["Tarification dynamique", "Veille des événements locaux", "Arbitrage des durées de séjour"],
    icon: "linen",
  },
  {
    id: "litiges",
    index: "06",
    title: "Cautions & litiges",
    summary:
      "Dépôt de garantie, dégradations, réclamations : nous traitons directement avec la plateforme. Vous n'entrez jamais dans le conflit.",
    details: ["Prise en charge des cautions", "Litiges plateforme", "Intervention en moins d'une heure"],
    icon: "tools",
  },
];

/**
 * Des engagements tenables dès le premier bien plutôt qu'un palmarès :
 * la maison a été créée en juin 2026.
 */
export const stats = [
  { value: 30, suffix: " %", label: "De gains visés au minimum", note: "Sur les revenus de votre logement" },
  { value: 1, suffix: " h", label: "Délai d'intervention", note: "Moins d'une heure sur les urgences" },
  { value: 7, suffix: "j/7", label: "Conciergerie joignable", note: "De 8 h à 22 h, week-ends compris" },
  { value: 0, suffix: "", label: "Rendez-vous à honorer", note: "Entrées et sorties en autonomie, 24 h/24" },
];

// À REMPLACER : délais et intitulés à caler sur votre façon réelle de travailler.
export const processSteps = [
  {
    index: "01",
    title: "Visite & diagnostic",
    text:
      "Nous visitons votre logement, mesurons son potentiel en courte durée et vous remettons une estimation chiffrée, sans engagement.",
    aside: "Estimation gratuite et sans engagement",
  },
  {
    index: "02",
    title: "Mise en scène",
    text:
      "Photographies, rédaction de l'annonce, équipement d'accès autonome. Votre logement devient une adresse qui se remarque.",
    aside: "Photos et rédaction incluses",
  },
  {
    index: "03",
    title: "Mise en marché",
    text:
      "Diffusion sur Airbnb, Booking et les autres plateformes, tarification dynamique et sélection des voyageurs accueillis.",
    aside: "Plateformes synchronisées",
  },
  {
    index: "04",
    title: "Exploitation sereine",
    text:
      "Accueil autonome, ménage, cautions, litiges, versement des loyers : vous ne conservez qu'une chose, la clé de chez vous.",
    aside: "Mandat d'un an",
  },
];

/**
 * Barème dégressif à trois paliers de chiffre d'affaires.
 * À CONFIRMER : les seuils de chaque tranche ne sont pas encore fixés ici.
 */
export const plans = [
  {
    id: "palier-1",
    name: "Premier palier",
    rate: "23 %",
    rateNote: "sur la première tranche de revenus",
    pitch: "Le taux d'entrée, le temps que le logement trouve son rythme.",
    features: [
      "Annonce optimisée & diffusion",
      "Entrées et sorties autonomes",
      "Ménage entre chaque séjour",
      "Cautions et litiges pris en charge",
    ],
    featured: false,
  },
  {
    id: "palier-2",
    name: "Deuxième palier",
    rate: "18 %",
    rateNote: "sur la tranche intermédiaire",
    pitch: "Dès que les revenus montent, le taux descend.",
    features: [
      "Tout le premier palier",
      "Tarification dynamique quotidienne",
      "Veille des événements locaux",
      "Reporting propriétaire",
    ],
    featured: true,
  },
  {
    id: "palier-3",
    name: "Troisième palier",
    rate: "14 %",
    rateNote: "sur la tranche haute",
    pitch: "Le taux le plus bas, sur la part de revenus la plus élevée.",
    features: [
      "Tout le deuxième palier",
      "Arbitrage des durées de séjour",
      "Interlocuteur dédié",
      "Bilan annuel",
    ],
    featured: false,
  },
];

/**
 * Nos intérieurs : des pièces des logements que nous gérons, présentées
 * ensemble, sans distinction de bien.
 *
 * Photos : `public/interieurs/`, chacune en deux largeurs (`-600.webp` et
 * `-1000.webp`) — `src` en donne la racine. L'ordre est celui de la galerie.
 * `shape` règle le rythme : "arch" (haut en plein cintre), "tall" ou "wide".
 * `focus` (facultatif) recentre le cadrage, au format `object-position`.
 */
const PHOTOS = `${import.meta.env.BASE_URL}interieurs/`;

export const interiors = [
  {
    id: "chambre-bleue",
    room: "Chambre",
    src: `${PHOTOS}chambre-bleue`,
    alt: "Chambre au mur bleu canard, lit double et plaid moutarde",
    shape: "arch",
  },
  {
    id: "cuisine",
    room: "Cuisine",
    src: `${PHOTOS}cuisine`,
    alt: "Cuisine équipée aux plans de travail rouges et cave à vin",
    shape: "tall",
  },
  {
    id: "salle-d-eau",
    room: "Salle d'eau",
    src: `${PHOTOS}salle-d-eau`,
    alt: "Salle de bain en pavés de verre et escalier en colimaçon",
    shape: "wide",
  },
  {
    id: "chambre-rose",
    room: "Chambre",
    src: `${PHOTOS}chambre-rose`,
    alt: "Chambre aux murs ocre, rideaux roses et couvre-lit fleuri",
    shape: "arch",
  },
  {
    id: "salon",
    room: "Salon",
    src: `${PHOTOS}salon`,
    alt: "Salon avec canapé et fauteuil chocolat, sol en marbre",
    shape: "tall",
    focus: "50% 62%",
  },
  {
    id: "cave",
    room: "Cave voûtée",
    src: `${PHOTOS}cave`,
    alt: "Cave voûtée en pierre aménagée avec mange-debout",
    shape: "arch",
  },
  {
    id: "chambre-bleue-2",
    room: "Chambre",
    src: `${PHOTOS}chambre-bleue-2`,
    alt: "La chambre bleue vue depuis l'entrée",
    shape: "tall",
  },
];

/**
 * ⚠ PLACEHOLDERS. Aucun de ces avis n'est réel : publier de faux
 * témoignages est une pratique commerciale trompeuse (art. L121-2 du code
 * de la consommation). À remplacer par de vrais retours — avec l'accord
 * des propriétaires — ou à retirer de la page en attendant d'en avoir.
 */
export const testimonials = [
  {
    id: "avis-1",
    quote:
      "Mon logement tourne sans que j'aie à y penser. Les voyageurs entrent seuls, le ménage est fait, et je reçois le récapitulatif chaque mois.",
    author: "Prénom Nom",
    role: "Propriétaire",
  },
  {
    id: "avis-2",
    quote:
      "Le bien a été mis en ligne rapidement, photos comprises. Les premières réservations ont suivi dans la foulée.",
    author: "Prénom Nom",
    role: "Propriétaire",
  },
  {
    id: "avis-3",
    quote:
      "Un dégât des eaux un dimanche soir : quelqu'un était sur place dans l'heure. Je n'ai eu à gérer ni le voyageur, ni l'assurance.",
    author: "Prénom Nom",
    role: "Propriétaire",
  },
];

export const faq = [
  {
    q: "Combien mon logement peut-il me rapporter ?",
    a: "Cela dépend du bien, de son emplacement et de la saison — c'est pour cela que nous commençons par une visite et une estimation chiffrée, gratuite et sans engagement. Notre objectif est d'aller chercher au minimum 30 % de revenus de plus qu'une exploitation non optimisée, en travaillant l'annonce, le calendrier et les prix au quotidien.",
  },
  {
    q: "Combien cela va-t-il me coûter ?",
    a: "Une commission prélevée sur les revenus perçus, selon un barème à trois paliers — 23 %, 18 % puis 14 % — qui baisse à mesure que le chiffre d'affaires du logement augmente. S'y ajoutent des frais de mise en service à l'entrée, qui couvrent l'inventaire, l'équipement d'accès autonome et la préparation du logement. Aucun abonnement mensuel.",
  },
  {
    q: "Vous occupez-vous vraiment de tout ?",
    a: "Oui : création et diffusion de l'annonce, photographies, calendrier, tarification, échanges avec les voyageurs, entrées et sorties, ménage, linge, cautions et litiges. Il ne vous reste qu'une décision à prendre, celle de bloquer vos dates.",
  },
  {
    q: "Gérez-vous la casse et les litiges d'assurance ?",
    a: "Oui, du premier au dernier courrier. Un état des lieux photographique est réalisé après chaque départ, ce qui rend la déclaration incontestable. Nous retenons le dépôt de garantie si nécessaire et menons le dossier auprès de la plateforme et de l'assurance. Vous n'entrez jamais dans le conflit.",
  },
  {
    q: "Qui fait le ménage ?",
    a: "Nous. Un ménage complet entre chaque séjour, linge de maison et consommables compris, avec un contrôle avant l'arrivée suivante. C'est ce poste qui fait la différence sur les avis voyageurs, nous ne le sous-estimons jamais.",
  },
  {
    q: "Puis-je utiliser mon logement quand je veux ?",
    a: "Bien sûr, il reste le vôtre. Vous bloquez vos dates quand vous le souhaitez depuis votre calendrier, et nous préparons le logement pour votre arrivée comme pour celle d'un voyageur.",
  },
];
