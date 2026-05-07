/**
 * MODALS LOADER — CMS-driven
 * Reads from data/modals/*.json (Decap CMS), falls back to legacy MODAL_PAGES.
 */
const _modalCache = {};

async function loadModalFromCMS(id) {
  if (_modalCache[id]) return _modalCache[id];
  try {
    const res = await fetch(`data/modals/${id}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    _modalCache[id] = data;
    return data;
  } catch(e) { return null; }
}

function renderCMSModal(data) {
  const lang = window.currentLang || 'fr';
  const title   = data.title?.[lang] || data.title?.fr || data[`title_${lang}`] || data.title_fr || "";
  const eyebrow = data.eyebrow?.[lang] || data.eyebrow?.fr || data[`eyebrow_${lang}`] || data.eyebrow_fr || "";
  const closeLabel = lang==='fr'?'Fermer':lang==='es'?'Cerrar':'Close';
  return `
    <div class="page-modal-header">
      <div class="page-modal-eyebrow">${eyebrow}</div>
      <div class="page-modal-title">${title}</div>
      <button class="page-modal-close" onclick="closePageModal()" aria-label="${closeLabel}">✕</button>
    </div>
    <div class="page-modal-body">
      ${(data.sections||[]).map(s=>renderCMSSection(s,lang)).join('')}
    </div>`;
}

function renderCMSSection(s, lang) {
  const txt = () => s[`text_${lang}`] || s.text_fr || s.text || '';
  switch(s.type) {
    case 'intro':    return `<p class="pm-intro">${txt()}</p>`;
    case 'heading':  return `<h3 class="pm-heading">${txt()}</h3>`;
    case 'body':     return `<p class="pm-body">${txt()}</p>`;
    case 'note':     return `<p class="pm-note">${txt()}</p>`;
    case 'divider':  return `<hr class="pm-divider">`;
    case 'image':    return `<img class="pm-image" src="${s.src}" alt="${s.alt_fr||''}" onerror="this.style.display='none'">`;
    case 'list':     return `<ul class="pm-list">${(s.items||[]).map(i=>`<li>${i[`text_${lang}`]||i.text_fr||i.item||''}</li>`).join('')}</ul>`;
    case 'linklist': return `<ul class="pm-linklist">${(s.items||[]).map(i=>`<li><a href="${i.url||'#'}" target="_blank" rel="noopener">${svgExtLinkInline(12)} ${i[`label_${lang}`]||i.label_fr||''}</a></li>`).join('')}</ul>`;
    case 'cta': {
      const label = s.label?.[lang] || s.label?.fr || s['label_'+lang] || s.label_fr || '';
      const href  = s.href||'#';
      const ext   = href.startsWith('http')||href.startsWith('mailto');
      const cls   = s.style==='primary'?'btn pm-btn-primary':'btn btn-outline pm-btn-secondary';
      return `<div class="pm-cta-wrap"><a class="${cls}" href="${href}" ${ext?'target="_blank" rel="noopener"':''}>${label}</a></div>`;
    }
    default: return '';
  }
}

async function openPageModal(id) {
  const overlay = document.getElementById('page-modal-overlay');
  const panel   = document.getElementById('page-modal-panel');
  if (!overlay||!panel) return;
  const lang = window.currentLang||'fr';
  const closeLabel = lang==='fr'?'Fermer':lang==='es'?'Cerrar':'Close';

  panel.innerHTML = `<div class="page-modal-header"><div class="page-modal-title" style="color:rgba(255,255,255,0.5)">…</div><button class="page-modal-close" onclick="closePageModal()">✕</button></div>`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // 1. Try CMS JSON
  const cmsData = await loadModalFromCMS(id);
  if (cmsData) { panel.innerHTML = renderCMSModal(cmsData); return; }

  // 2. Fall back to legacy hardcoded MODAL_PAGES
  const legacy = window.MODAL_PAGES && window.MODAL_PAGES.find(p=>p.id===id);
  if (legacy) {
    panel.innerHTML = `
      <div class="page-modal-header">
        <div class="page-modal-eyebrow">${t(legacy.eyebrowKey)}</div>
        <div class="page-modal-title">${t(legacy.titleKey)}</div>
        <button class="page-modal-close" onclick="closePageModal()" aria-label="${closeLabel}">✕</button>
      </div>
      <div class="page-modal-body">${legacy.content().map(s=>renderSection(s)).join('')}</div>`;
    return;
  }

  // 3. Not found
  panel.innerHTML = `<div class="page-modal-header"><div class="page-modal-title">Introuvable</div><button class="page-modal-close" onclick="closePageModal()">✕</button></div><div class="page-modal-body"><p class="pm-body">La modale <code>${id}</code> n'existe pas encore. Créez-la dans <strong>/admin → Fenêtres modales</strong>.</p></div>`;
}

function closePageModal() {
  const o = document.getElementById('page-modal-overlay');
  if (o) o.classList.remove('open');
  document.body.style.overflow='';
}

function initPageModals() {
  if (document.getElementById('page-modal-overlay')) return;
  const o = document.createElement('div');
  o.id='page-modal-overlay'; o.className='page-modal-overlay';
  o.setAttribute('role','dialog'); o.setAttribute('aria-modal','true');
  o.innerHTML=`<div class="page-modal-panel" id="page-modal-panel"></div>`;
  document.body.appendChild(o);
  o.addEventListener('click', e=>{ if(e.target===o) closePageModal(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closePageModal(); });
}

function initModalLinks() {
  document.addEventListener('click', e=>{
    const a = e.target.closest('a[href^="modal:"]');
    if (!a) return;
    e.preventDefault();
    openPageModal(a.getAttribute('href').slice(6));
  });
}

function svgExtLinkInline(s) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
}

window.openPageModal=openPageModal; window.closePageModal=closePageModal;
window.initPageModals=initPageModals; window.initModalLinks=initModalLinks;
