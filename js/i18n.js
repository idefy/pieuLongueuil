/**
 * TRADUCTIONS — i18n
 * ====================
 * Les chaînes sont chargées depuis data/translations.json (géré par le CMS).
 * Ce fichier ne contient plus les chaînes directement — modifier via /admin.
 */

window.TRANSLATIONS = { fr: {}, es: {}, en: {} };
window._translationsLoaded = false;

/* Load translations.json and unpack into TRANSLATIONS */
async function loadTranslations() {
  try {
    const res = await fetch('data/translations.json');
    const data = await res.json();
    // data is { key: { fr, es, en }, ... }
    Object.entries(data).forEach(([key, vals]) => {
      if (vals.fr) window.TRANSLATIONS.fr[key] = vals.fr;
      if (vals.es) window.TRANSLATIONS.es[key] = vals.es;
      if (vals.en) window.TRANSLATIONS.en[key] = vals.en;
    });
    window._translationsLoaded = true;
  } catch(e) {
    console.warn('translations.json not found, using fallback', e);
  }
}

function t(key) {
  const lang = window.currentLang || window.SITE_CONFIG?.defaultLang || 'fr';
  return (window.TRANSLATIONS[lang]?.[key])
      || (window.TRANSLATIONS['fr']?.[key])
      || key;
}

window.t = t;
window.loadTranslations = loadTranslations;
