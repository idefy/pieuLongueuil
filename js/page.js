/**
 * PAGE.JS — Subpage Engine
 * =========================
 * Loads the correct page JSON from data/pages/?slug=.json,
 * renders all sections, manages i18n, nav dropdown, and footer.
 *
 * URL format: page.html?p=slug
 * Direct URL: page.html?p=exemple  → loads data/pages/exemple.json
 */

/* ── Bootstrap ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  applyConfigToPage();
  initLang();
  await Promise.all([loadTranslations(), loadSettings()]);
  updateI18n();
  initLangButtons();
  initNav();

  const slug = getSlug();
  if (!slug) {
    renderNotFound();
    return;
  }

  const [pageData, allPages] = await Promise.all([
    fetchPage(slug),
    fetchAllPages()
  ]);

  if (!pageData) {
    renderNotFound();
  } else {
    renderPage(pageData);
  }

  renderNavDropdown(allPages, slug);
  renderFooter();
  initPageModals();
  initModalLinks();
  initMobileNav();
});

/* ── URL slug ────────────────────────────────────────────── */
function getSlug() {
  return new URLSearchParams(window.location.search).get('p') || '';
}

/* ── Apply config colors/fonts (same as main site) ──────── */
function applyConfigToPage() {
  const c = window.SITE_CONFIG?.colors || {};
  const r = document.documentElement.style;
  const map = {
    '--c-primary':c.primary,'--c-secondary':c.secondary,'--c-accent':c.accent,
    '--c-light':c.light,'--c-dark':c.dark,'--c-text':c.text,'--c-muted':c.muted,
    '--c-border':c.border,'--c-surface':c.surface,'--c-warm':'#F5EFE6',
    '--c-highlight':c.highlight,'--c-cream':'#FDF9F3'
  };
  Object.entries(map).forEach(([k,v]) => v && r.setProperty(k,v));
  const lnk = document.createElement('link');
  lnk.rel='stylesheet';
  lnk.href = window.SITE_CONFIG?.fonts?.google || '';
  if (lnk.href) document.head.appendChild(lnk);
}

/* ── Load settings.json (colors/social override) ─────────── */
async function loadSettings() {
  try {
    const sr = await fetch('data/settings.json').then(r=>r.json());
    if (!sr) return;
    const cfg = window.SITE_CONFIG;
    if (sr.stakeName)   cfg.stakeName   = sr.stakeName;
    if (sr.mission)     cfg.mission     = sr.mission;
    if (sr.chapelImage) cfg.chapelImage = sr.chapelImage;
    if (sr.social)      cfg.social      = sr.social;
    if (sr.colors)      Object.assign(cfg.colors, sr.colors);
    applyConfigToPage(); // re-apply with CMS values
  } catch(e) {}
}

/* ── Fetch single page ────────────────────────────────────── */
async function fetchPage(slug) {
  try {
    const res = await fetch(`data/pages/${slug}.json`);
    if (!res.ok) return null;
    return await res.json();
  } catch(e) { return null; }
}

/* ── Fetch all pages (for nav dropdown) ─────────────────── */
async function fetchAllPages() {
  try {
    const res = await fetch('data/pages-index.json');
    if (!res.ok) return [];
    const data = await res.json();
    // Handle both plain array and wrapped {pages_index: [...]}
    return Array.isArray(data) ? data : (data.pages_index || []);
  } catch(e) { return []; }
}

/* ── Render page ─────────────────────────────────────────── */
function renderPage(data) {
  const lang = window.currentLang || 'fr';
  // Support both flat (title_fr) and nested (title.fr) from CMS
  const title    = data[`title_${lang}`]    || data.title?.[lang]    || data.title?.fr    || '';
  const subtitle = data[`subtitle_${lang}`] || data.subtitle?.[lang] || data.subtitle?.fr || '';

  // <title>
  document.getElementById('page-title').textContent = `${title} — Pieu Longueuil`;

  // Hero — use language-specific image if available, else default
  const heroImg = data[`hero_image_${lang}`] || data.hero_image || '';
  if (heroImg) {
    const bg = document.getElementById('subpage-hero-bg');
    bg.style.backgroundImage = `url('${heroImg}')`;
    bg.style.display = 'block';
    document.getElementById('subpage-hero').classList.add('has-image');
  }

  document.getElementById('subpage-title').textContent = title;

  if (subtitle) {
    const sub = document.getElementById('subpage-subtitle');
    sub.textContent = subtitle;
    sub.style.display = 'block';
  }

  // Content sections
  const container = document.getElementById('subpage-content');
  container.innerHTML = (data.sections || []).map(s => renderSection(s, lang)).join('');
}

/* ── Render a single section ─────────────────────────────── */
function renderSection(s, lang) {
  const txt = () => s[`text_${lang}`] || s.text_fr || s.text || '';

  switch(s.type) {
    case 'eyebrow':
      return `<div class="sp-eyebrow">${txt()}</div>`;

    case 'intro':
      return `<p class="sp-intro">${renderInlineHTML(txt())}</p>`;

    case 'heading':
      return `<h2 class="sp-heading">${txt()}</h2>`;

    case 'subheading':
      return `<h3 class="sp-subheading">${txt()}</h3>`;

    case 'body':
      return `<p class="sp-body">${renderInlineHTML(txt())}</p>`;

    case 'note':
      return `<p class="sp-note">${renderInlineHTML(txt())}</p>`;

    case 'callout':
      return `<div class="sp-callout">${renderInlineHTML(txt())}</div>`;

    case 'divider':
      return `<hr class="sp-divider">`;

    case 'image': {
      const alt     = s[`alt_${lang}`] || s.alt_fr || '';
      const caption = s[`caption_${lang}`] || s.caption_fr || '';
      // Per-language image override: src_fr / src_es / src_en take precedence over src
      const imgSrc  = s[`src_${lang}`] || s.src || '';
      if (!imgSrc) return '';
      return `<figure style="margin:24px 0">
        <img class="sp-image" src="${imgSrc}" alt="${alt}" onerror="this.style.display='none'">
        ${caption ? `<figcaption style="font-size:13px;color:var(--c-muted);text-align:center;margin-top:8px;font-style:italic">${caption}</figcaption>` : ''}
      </figure>`;
    }

    case 'list': {
      const items = s.items || [];
      return `<ul class="sp-list">${items.map(item => {
        const text = item[`text_${lang}`] || item.text_fr || item.item || '';
        return `<li>${renderInlineHTML(text)}</li>`;
      }).join('')}</ul>`;
    }

    case 'linklist': {
      const items = s.items || [];
      return `<ul class="sp-linklist">${items.map(item => {
        const label = item[`label_${lang}`] || item.label_fr || '';
        const url   = item[`url_${lang}`]   || item.url || '#';
        const isExt = url.startsWith('http') || url.startsWith('mailto');
        const isModal = url.startsWith('modal:');
        if (isModal) {
          const mid = url.slice(6);
          return `<li><span style="cursor:pointer" onclick="openPageModal('${mid}')" class="sp-linklist-item">
            ${svgExt(12)} ${label}
          </span></li>`;
        }
        return `<li><a href="${url}" ${isExt?'target="_blank" rel="noopener"':''}>
          ${svgExt(12)} ${label}
        </a></li>`;
      }).join('')}</ul>`;
    }

    case 'cta': {
      const label  = s[`label_${lang}`] || s.label_fr || '';
      const href   = s[`href_${lang}`]  || s.href || '#';
      const isExt  = href.startsWith('http') || href.startsWith('mailto');
      const isModal = href.startsWith('modal:');
      const style  = s.style === 'secondary' ? 'btn' : 'btn btn-gold';
      if (isModal) {
        return `<div class="sp-cta-wrap"><button class="${style}" onclick="openPageModal('${href.slice(6)}')">${label}</button></div>`;
      }
      return `<div class="sp-cta-wrap"><a class="${style}" href="${href}" ${isExt?'target="_blank" rel="noopener"':''}>${label}</a></div>`;
    }

    case 'page_link': {
      // Link to another subpage
      const label = s[`label_${lang}`] || s.label_fr || '';
      const slug  = s.slug || '';
      return `<div class="sp-cta-wrap"><a class="btn" href="page.html?p=${slug}">${label} →</a></div>`;
    }

    default:
      return '';
  }
}

/* ── Inline HTML (bold, italic, links in body text) ─────── */
function renderInlineHTML(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

/* ── Not found ───────────────────────────────────────────── */
function renderNotFound() {
  const lang = window.currentLang || 'fr';
  document.getElementById('subpage-title').textContent =
    lang==='fr' ? 'Page introuvable' : lang==='es' ? 'Página no encontrada' : 'Page not found';
  document.getElementById('subpage-content').innerHTML = `
    <div class="sp-not-found">
      <h2>${lang==='fr'?'Page introuvable':lang==='es'?'Página no encontrada':'Page not found'}</h2>
      <p>${lang==='fr'?'Cette page n\'existe pas ou a été déplacée.':lang==='es'?'Esta página no existe o fue movida.':'This page does not exist or has been moved.'}</p>
      <a href="index.html" class="btn btn-gold">${lang==='fr'?'Retour à l\'accueil':lang==='es'?'Volver al inicio':'Back to home'}</a>
    </div>`;
}

/* ── Nav dropdown ────────────────────────────────────────── */
function renderNavDropdown(pages, currentSlug) {
  const lang = window.currentLang || 'fr';
  const visible = pages.filter(p => p.visible_in_nav)
    .sort((a,b) => (a.nav_order||99) - (b.nav_order||99));

  if (!visible.length) return;

  const dropdown = document.getElementById('nav-pages-dropdown');
  const list     = document.getElementById('nav-pages-list');
  const mobileSection = document.getElementById('mobile-pages-section');
  const mobileList    = document.getElementById('mobile-pages-list');

  dropdown.style.display = 'block';

  list.innerHTML = visible.map(p => {
    const label = p.title?.[lang] || p.title?.fr || p.slug;
    const active = p.slug === currentSlug ? ' class="active"' : '';
    return `<li role="menuitem"><a href="page.html?p=${p.slug}"${active}>${label}</a></li>`;
  }).join('');

  if (mobileSection && mobileList) {
    mobileSection.style.display = 'block';
    mobileList.innerHTML = visible.map(p => {
      const label = p.title?.[lang] || p.title?.fr || p.slug;
      return `<a href="page.html?p=${p.slug}" style="display:block;font-size:14px;color:rgba(255,255,255,0.7);padding:8px 0 8px 12px;border-bottom:1px solid rgba(255,255,255,0.05)">${label}</a>`;
    }).join('');
  }
}

/* ── Footer ──────────────────────────────────────────────── */
function renderFooter() {
  const cfg  = window.SITE_CONFIG;
  const lang = window.currentLang || 'fr';
  const disc = document.getElementById('footer-disclaimer');
  if (disc) disc.textContent = cfg.disclaimer?.[lang] || cfg.disclaimer?.fr || '';
  ['fb','yt','ig'].forEach(k => {
    const el = document.getElementById('footer-'+k);
    const map = {fb:'facebook',yt:'youtube',ig:'instagram'};
    if (el && cfg.social?.[map[k]]) el.href = cfg.social[map[k]];
  });
}

/* ── Language ────────────────────────────────────────────── */
function initLang() {
  const saved = localStorage.getItem('pieu-lang');
  const cfg   = window.SITE_CONFIG;
  window.currentLang = (saved && cfg.availableLangs?.includes(saved)) ? saved : (cfg.defaultLang || 'fr');
  updateLangBtns();
}

function setLang(l) {
  window.currentLang = l;
  localStorage.setItem('pieu-lang', l);
  updateLangBtns();
  updateI18n();
  // Re-render page content in new language
  const slug = getSlug();
  if (slug) fetchPage(slug).then(data => { if (data) renderPage(data); });
  fetchAllPages().then(pages => renderNavDropdown(pages, slug));
  renderFooter();
}

function updateLangBtns() {
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === window.currentLang));
}

function initLangButtons() {
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.addEventListener('click', () => setLang(b.dataset.lang)));
}

function updateI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el =>
    el.textContent = t(el.dataset.i18n));
}

/* ── Nav ─────────────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () =>
    nav.classList.toggle('scrolled', window.scrollY > 40));

  // Dropdown toggle
  const trigger = document.getElementById('nav-pages-trigger');
  const dropList = document.getElementById('nav-pages-list');
  if (trigger && dropList) {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const open = dropList.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open);
      trigger.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
    });
    document.addEventListener('click', e => {
      if (!trigger.closest('li').contains(e.target)) {
        dropList.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.querySelector('svg').style.transform = '';
      }
    });
  }
}

function initMobileNav() {
  const hb  = document.getElementById('hamburger');
  const mob = document.getElementById('mobile-nav');
  if (hb && mob) hb.addEventListener('click', () => mob.classList.toggle('open'));
}

/* ── SVG helper ──────────────────────────────────────────── */
function svgExt(s) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;flex-shrink:0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
}
