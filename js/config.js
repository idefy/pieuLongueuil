/**
 * SITE CONFIGURATION — Pieu Longueuil
 * =====================================
 * Central file for all site-wide settings.
 * Edit here; changes propagate everywhere automatically.
 */
const SITE_CONFIG = {

  /* ── Identité ──────────────────────────────────────────── */
  stakeName: "Pieu Longueuil Québec",
  churchName: {
    fr: "Église de Jésus-Christ des Saints des Derniers Jours",
    es: "Iglesia de Jesucristo de los Santos de los Últimos Días",
    en: "The Church of Jesus Christ of Latter-day Saints"
  },
  mission: {
    fr: "Nous sommes des disciples engagés de Jésus-Christ. D'un seul cœur et d'un seul esprit, nous exerçons notre foi à faire avancer Son œuvre pour rassembler Israël.",
    es: "Somos discípulos comprometidos de Jesucristo. De un solo corazón y de una sola mente, ejercemos nuestra fe para hacer avanzar Su obra para reunir a Israel.",
    en: "We are committed disciples of Jesus Christ. With one heart and one mind, we exercise our faith to advance His work to gather Israel."
  },

  /* ── Image chapelle ─────────────────────────────────────── */
  /* Remplacez ce chemin par votre image hébergée */
  chapelImage: "assets/chapel.jpg",

  /* ── Couleurs & Thème ───────────────────────────────────── */
  /* Modifiez ici pour changer l'identité visuelle du site entier */
  colors: {
    primary:     "#1B3A6B",   /* Bleu marine - couleur principale */
    secondary:   "#B8924A",   /* Or - accent */
    accent:      "#2C5F9E",   /* Bleu moyen - hover/liens */
    light:       "#F7F5F0",   /* Fond crème */
    dark:        "#0D1F3C",   /* Titre sombre */
    text:        "#2D2D2D",   /* Texte courant */
    muted:       "#6B6B6B",   /* Texte secondaire */
    border:      "#E0DACE",   /* Bordures */
    surface:     "#FFFFFF",   /* Surfaces blanches */
    highlight:   "#EAF0F9",   /* Fond de mise en valeur */
  },

  /* ── Typographie ────────────────────────────────────────── */
  fonts: {
    heading: "'Cormorant Garamond', Georgia, serif",
    body:    "'Libre Baskerville', Georgia, serif",
    ui:      "'Outfit', sans-serif",
    google:  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap"
  },

  /* ── Navigation (ordre des onglets) ─────────────────────── */
  /* Retirer ou réordonner selon vos besoins */
  navOrder: ["home", "ressources", "pastoral", "dirigeants", "organisations"],

  /* ── Liens officiels Église ─────────────────────────────── */
  officialLinks: {
    churchSite:  "https://www.churchofjesuschrist.org/?lang=fra",
    calendar:    "https://www.churchofjesuschrist.org/calendar",
    directory:   "https://www.churchofjesuschrist.org/directory",
    lcr:         "https://lcr.churchofjesuschrist.org",
    tools:       "https://www.churchofjesuschrist.org/tools",
    gospel:      "https://www.comeuntochrist.org/?lang=fra",
    temple:      "https://www.churchofjesuschrist.org/temples",
    seminary:    "https://www.churchofjesuschrist.org/si/?lang=fra",
    institute:   "https://www.churchofjesuschrist.org/si/institute?lang=fra",
    manual:      "https://www.churchofjesuschrist.org/study/manual/general-handbook?lang=fra",
    familySearch:"https://www.familysearch.org",
  },

  /* ── Réseaux sociaux ────────────────────────────────────── */
  social: {
    facebook:  "https://www.facebook.com/membresPieuLongueuil",
    youtube:   "https://www.youtube.com/channel/UCQs1I1gEuprnoL1yel1s7ww",
    instagram: "https://www.instagram.com/eglisedejesuschristlongueuil",
    twitter:   "https://twitter.com/PieuLongueuil",
  },

  /* ── Bulletin ───────────────────────────────────────────── */
  newsletter: {
    fr: "http://subscribepage.io/Iiz4Xc",
    es: "http://subscribepage.io/WJSnVm",
    en: null
  },

  /* ── Footer ─────────────────────────────────────────────── */
  disclaimer: {
    fr: "Ce site est à l'intention des membres du Pieu de Longueuil de l'Église de Jésus-Christ des Saints des Derniers Jours. Il est fourni à titre d'information et n'est pas un site officiel de l'Église.",
    es: "Este sitio está destinado a los miembros de la Estaca Longueuil de La Iglesia de Jesucristo de los Santos de los Últimos Días. Se proporciona como información y no es un sitio oficial de la Iglesia.",
    en: "This site is intended for members of the Longueuil Stake of The Church of Jesus Christ of Latter-day Saints. It is provided for informational purposes and is not an official Church website."
  },

  /* ── Langue par défaut ──────────────────────────────────── */
  defaultLang: "fr",
  availableLangs: ["fr", "es", "en"],
};

/* Expose globally */
window.SITE_CONFIG = SITE_CONFIG;
