/**
 * TRADUCTIONS — i18n
 * Chargé depuis data/i18n/*.json (géré par le CMS via /admin).
 */
window.TRANSLATIONS = { fr: {}, es: {}, en: {} };

async function loadTranslations() {
  const groups = ['nav','accueil','ressources','pastoral','dirigeants','org','commun'];
  try {
    const results = await Promise.all(
      groups.map(g => fetch(`data/i18n/${g}.json`).then(r => r.json()).catch(() => ({})))
    );
    results.forEach(chunk => {
      Object.entries(chunk).forEach(([key, vals]) => {
        if (vals.fr) window.TRANSLATIONS.fr[key] = vals.fr;
        if (vals.es) window.TRANSLATIONS.es[key] = vals.es;
        if (vals.en) window.TRANSLATIONS.en[key] = vals.en;
      });
    });
  } catch(e) {
    console.warn('Translation load error', e);
  }
}

function t(key) {
  const lang = window.currentLang || window.SITE_CONFIG?.defaultLang || 'fr';
  return window.TRANSLATIONS[lang]?.[key]
      || window.TRANSLATIONS['fr']?.[key]
      || key;
}

window.t = t;
window.loadTranslations = loadTranslations;
