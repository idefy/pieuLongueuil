/* PIEU LONGUEUIL v2 — Application */
document.addEventListener('DOMContentLoaded', async () => {
  applyConfig(); initLang(); await loadData(); renderAll(); initNav(); initScrollEffects(); initDirTabs(); initFicheModal(); initPageModals(); initModalLinks();
});

function applyConfig() {
  const c = SITE_CONFIG.colors, r = document.documentElement.style;
  Object.entries({
    '--c-primary':c.primary,'--c-secondary':c.secondary,'--c-accent':c.accent,
    '--c-light':c.light,'--c-dark':c.dark,'--c-text':c.text,'--c-muted':c.muted,
    '--c-border':c.border,'--c-surface':c.surface
  }).forEach(([k,v]) => r.setProperty(k,v));
  const lnk = document.createElement('link');
  lnk.rel='stylesheet';
  lnk.href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700;900&display=swap';
  document.head.appendChild(lnk);
}

function initLang() {
  const saved = localStorage.getItem('pieu-lang');
  window.currentLang = (saved && SITE_CONFIG.availableLangs.includes(saved)) ? saved : SITE_CONFIG.defaultLang;
  updateLangBtns();
}
function setLang(l) { window.currentLang=l; localStorage.setItem('pieu-lang',l); updateLangBtns(); renderAll(); }
function updateLangBtns() { document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===window.currentLang)); }

let leadersData=[], resourcesData=[];
async function loadData() {
  try {
    const [lr, rr, sr] = await Promise.all([
      fetch('data/leaders.json').then(r=>r.json()),
      fetch('data/resources.json').then(r=>r.json()),
      fetch('data/settings.json').then(r=>r.json()).catch(()=>null)
    ]);
    leadersData    = (Array.isArray(lr) ? lr : lr.leaders || []).filter(l=>l.active!==false);
    resourcesData  = (Array.isArray(rr) ? rr : rr.resources || []).filter(r=>r.active!==false);
    // Merge CMS settings into SITE_CONFIG (CMS values take precedence)
    if (sr && window.SITE_CONFIG) {
      if (sr.stakeName)   window.SITE_CONFIG.stakeName   = sr.stakeName;
      if (sr.mission)     window.SITE_CONFIG.mission     = sr.mission;
      if (sr.chapelImage) window.SITE_CONFIG.chapelImage = sr.chapelImage;
      if (sr.social)      window.SITE_CONFIG.social      = sr.social;
      if (sr.newsletter)  window.SITE_CONFIG.newsletter  = sr.newsletter;
      if (sr.colors)      Object.assign(window.SITE_CONFIG.colors, sr.colors);
    }
  } catch(e) { console.warn('Data load failed', e); }
}

function renderAll() {
  renderHero(); renderQuickStrip(); renderRessources(); renderPastoral(); renderDirigeants(); renderOrganisations(); renderFooter(); updateI18n();
  initScrollEffects();
}

function renderHero() {
  const l = window.currentLang, cfg = SITE_CONFIG;
  setEl('hero-church',cfg.churchName[l]||cfg.churchName.fr);
  setEl('hero-title', cfg.stakeName);
  setEl('hero-mission',cfg.mission[l]||cfg.mission.fr);
  const bg=document.getElementById('hero-bg');
  if(bg){ bg.style.backgroundImage=`url('${cfg.chapelImage}')`; const i=new Image(); i.onload=()=>bg.classList.add('loaded'); i.src=cfg.chapelImage; }
}

function renderQuickStrip() {
  const el=document.getElementById('quick-strip'); if(!el) return;
  const items=[
    {num:'01', tkey:'nav_ressources', desc:'res_outils_desc', href:'#ressources'},
    {num:'02', tkey:'nav_pastoral',   desc:'pastoral_intro',  href:'#pastoral'},
    {num:'03', tkey:'nav_dirigeants', desc:'dirigeants_intro',href:'#dirigeants'},
    {num:'04', tkey:'nav_organisations',desc:'org_intro',     href:'#organisations'},
  ];
  el.innerHTML=items.map(it=>`
    <a class="quick-item" href="${it.href}">
      <div class="qi-num">${it.num}</div>
      <div class="qi-title" data-i18n="${it.tkey}">${t(it.tkey)}</div>
      <div class="qi-desc" data-i18n="${it.desc}">${truncate(t(it.desc),75)}</div>
      <div class="qi-arrow">→</div>
    </a>`).join('');
}

function renderRessources() {
  const el=document.getElementById('res-grid'); if(!el) return;
  const cfg=SITE_CONFIG;
  const cards=[
    { icon:svgSettings, title:'res_outils_title', desc:'res_outils_desc',
      links:[{k:'res_outils_create',h:'#'},{k:'res_outils_manage',h:'#'},{k:'res_outils_dir',h:cfg.officialLinks.directory}]},
    { icon:svgStar, title:'res_temple_title', desc:'res_temple_desc',
      links:[{k:'res_temple_book',h:'modal:temple'},{k:'res_temple_fs',h:cfg.officialLinks.familySearch},{k:'res_temple_dist',h:'modal:distribution'}]},
    { icon:svgTrend, title:'res_autonomie_title', desc:'res_autonomie_desc',
      links:[{k:'read_more',h:'#pastoral'}]},
    { icon:svgCal, title:'res_entretien_title', desc:'res_entretien_desc',
      links:[{k:'res_entretien_rdv',h:'modal:rendez-vous'},{k:'res_entretien_prep',h:'modal:se-preparer'}]},
    { icon:svgBook, title:'res_instruire_title', desc:'res_instruire_desc',
      links:[{k:'res_instruire_sem',h:cfg.officialLinks.seminary},{k:'res_instruire_inst',h:cfg.officialLinks.institute}]},
    { icon:svgMail, title:'res_bulletin_title', desc:'res_bulletin_desc',
      links:[{k:'res_bulletin_sub_fr',h:cfg.newsletter.fr},{k:'res_bulletin_sub_es',h:cfg.newsletter.es}]},
  ];
  el.innerHTML=cards.map(c=>`
    <div class="res-card reveal">
      <div class="res-icon">${c.icon(28)}</div>
      <div class="res-title" data-i18n="${c.title}">${t(c.title)}</div>
      <div class="res-desc" data-i18n="${c.desc}">${t(c.desc)}</div>
      <div class="res-links">${c.links.map(l=>`
        <a class="res-link" href="${l.h}" ${l.h.startsWith('http')?'target="_blank" rel="noopener"':''}>
          ${svgChev(14)}<span data-i18n="${l.k}">${t(l.k)}</span>
        </a>`).join('')}
      </div>
    </div>`).join('');
}

function renderPastoral() {
  const el=document.getElementById('pastoral-grid'); if(!el) return;
  const lang=window.currentLang;
  el.innerHTML=(window.FICHES_DATA||[]).map((f,i)=>`
    <div class="fiche-card reveal" data-fiche="${f.id}" style="animation-delay:${i*0.06}s">
      <div class="fiche-img-wrap">
        <img class="fiche-img" src="${f.image}" alt="${f.title[lang]||f.title.fr}" loading="lazy" onerror="this.parentElement.style.background='${f.color}'">
        <div class="fiche-img-overlay"></div>
        <span class="fiche-num-badge">${f.num}</span>
      </div>
      <div class="fiche-body">
        <div class="fiche-body-title">${f.title[lang]||f.title.fr}</div>
        <div class="fiche-body-desc">${f.quote[lang]||f.quote.fr}</div>
        <div class="fiche-cta"><span>${t('read_more')}</span><span class="fiche-cta-arrow">→</span></div>
      </div>
    </div>`).join('');

  el.querySelectorAll('.fiche-card').forEach(card=>{
    card.addEventListener('click',()=>openFiche(card.dataset.fiche));
  });
}

function renderDirigeants() {
  const cfg=SITE_CONFIG, lang=window.currentLang;
  const all=resourcesData.filter(r=>r.section==='dirigeants');
  const panels={
    vision:  document.getElementById('dp-vision'),
    guides:  document.getElementById('dp-guides'),
    tutoriels:document.getElementById('dp-tutoriels'),
    officiel:document.getElementById('dp-officiel'),
  };

  const officialCards=[
    {title:t('dir_lcr'),     desc:t('visit_official'),href:cfg.officialLinks.lcr,     icon:svgDb},
    {title:t('dir_manual'),  desc:t('visit_official'),href:cfg.officialLinks.manual,  icon:svgBook},
    {title:t('dir_calendar'),desc:t('visit_official'),href:cfg.officialLinks.calendar,icon:svgCal},
    {title:t('dir_tools'),   desc:t('visit_official'),href:cfg.officialLinks.tools,   icon:svgSettings},
  ];
  if(panels.officiel) panels.officiel.innerHTML=`<div class="res-grid-2">${officialCards.map(o=>`
    <a class="dir-card" href="${o.href}" target="_blank" rel="noopener">
      <div class="res-icon">${o.icon(22)}</div>
      <div class="dir-card-title">${o.title}</div>
      <div class="dir-card-desc">${o.desc}</div>
      <div class="dir-card-ext">${svgExtLink(12)} ${t('visit_official')}</div>
    </a>`).join('')}</div>`;

  ['vision','guides','tutoriels'].forEach(cat=>{
    const items=all.filter(r=>r.category===cat);
    if(panels[cat]) panels[cat].innerHTML=items.length
      ? `<div class="res-grid-2">${items.map(r=>dirCard(r,lang)).join('')}</div>`
      : `<p style="color:var(--c-muted);font-size:14px">${t('loading')}</p>`;
  });
}

function dirCard(r,lang) {
  const title=r.title[lang]||r.title.fr, desc=r.description[lang]||r.description.fr;
  const ext=r.url&&r.url.startsWith('http');
  const iconFn={'book':svgBook,'heart':svgHeart,'users':svgUsers,'video':svgVideo,'file':svgFile,'target':svgTarget,'database':svgDb,'settings':svgSettings,'calendar':svgCal,'trendingUp':svgTrend,'globe':svgGlobe}[r.icon]||svgFile;
  return `<a class="dir-card" href="${r.url||'#'}" ${ext?'target="_blank" rel="noopener"':''}>
    <span class="dir-badge badge-${r.type}">${t('dir_type_'+r.type)||r.type}</span>
    <div class="dir-card-title">${title}</div>
    <div class="dir-card-desc">${desc}</div>
    ${ext?`<div class="dir-card-ext">${svgExtLink(11)} ${t('visit_official')}</div>`:''}
  </a>`;
}

function renderOrganisations() {
  const el=document.getElementById('org-content'); if(!el) return;
  const lang=window.currentLang;
  const orgOrder=['presidence','grandconseil','ss','jf','jg','primaire','ecole'];
  const byOrg={};
  leadersData.forEach(l=>{if(!byOrg[l.org])byOrg[l.org]=[];byOrg[l.org].push(l);});
  el.innerHTML=orgOrder.filter(o=>byOrg[o]&&byOrg[o].length).map(org=>`
    <div class="org-group reveal">
      <div class="org-group-title" data-i18n="org_${org}">${t('org_'+org)}</div>
      <div class="leaders-grid">${byOrg[org].map(l=>leaderCard(l,lang)).join('')}</div>
    </div>`).join('');
}

function leaderCard(l,lang) {
  const role=l.role[lang]||l.role.fr;
  const init=(l.name.split(' ').map(w=>w[0]).join('').slice(0,2)).toUpperCase();
  const fallback=`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 84"><circle cx="42" cy="42" r="42" fill="#1B3A6B"/><text x="42" y="47" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="26" font-family="Georgia,serif">${init}</text></svg>`)}`;
  return `<div class="leader-card">
    <img class="leader-photo" src="${l.photo}" alt="${l.name}" onerror="this.src='${fallback}'">
    <div class="leader-name">${l.name}</div>
    <div class="leader-role">${role}</div>
  </div>`;
}

function renderFooter() {
  const l=window.currentLang, cfg=SITE_CONFIG;
  setEl('footer-disclaimer', cfg.disclaimer[l]||cfg.disclaimer.fr);
  setEl('footer-church', cfg.churchName[l]||cfg.churchName.fr);
  ['fb','yt','ig','tw'].forEach(k=>{
    const el=document.getElementById('footer-'+k);
    const map={fb:'facebook',yt:'youtube',ig:'instagram',tw:'twitter'};
    if(el&&cfg.social[map[k]]) el.href=cfg.social[map[k]];
  });
}

function updateI18n() { document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n)); }

/* FICHE MODAL */
function initFicheModal() {
  const overlay=document.getElementById('fiche-overlay');
  if(!overlay) return;
  overlay.addEventListener('click',e=>{ if(e.target===overlay) closeFiche(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeFiche(); });
}

function openFiche(id) {
  const f=window.FICHES_DATA&&window.FICHES_DATA.find(x=>x.id===id); if(!f) return;
  const lang=window.currentLang;
  const overlay=document.getElementById('fiche-overlay'); if(!overlay) return;
  const title=f.title[lang]||f.title.fr;
  const quote=f.quote[lang]||f.quote.fr;
  const famille=(f.ideesFamille&&f.ideesFamille[lang])||f.ideesFamille&&f.ideesFamille.fr||[];
  const pastoral=(f.ideesPastorale&&f.ideesPastorale[lang])||f.ideesPastorale&&f.ideesPastorale.fr||[];
  const eglise=(f.ressourcesEglise&&f.ressourcesEglise.fr)||[];
  const communaute=(f.ressourcesCommunautaires&&f.ressourcesCommunautaires.fr)||[];

  const labels={
    fr:{fam:"Idées pour la famille",past:"Idées pour le service pastoral",egl:"Ressources de l'Église",com:"Ressources communautaires"},
    es:{fam:"Ideas para la familia",past:"Ideas para el servicio pastoral",egl:"Recursos de la Iglesia",com:"Recursos comunitarios"},
    en:{fam:"Ideas for the Family",past:"Ideas for Pastoral Service",egl:"Church Resources",com:"Community Resources"},
  };
  const lb=labels[lang]||labels.fr;

  document.getElementById('fiche-panel').innerHTML=`
    <div class="fiche-panel-hero">
      <img src="${f.image}" alt="${title}">
      <div class="fiche-panel-hero-overlay">
        <div class="fiche-panel-num">Fiche ${f.num}</div>
        <div class="fiche-panel-title">${title}</div>
      </div>
      <button class="fiche-panel-close" onclick="closeFiche()" aria-label="Fermer">✕</button>
    </div>
    <div class="fiche-panel-body">
      <div class="fiche-panel-quote">${quote}</div>
      ${famille.length?`<div class="fiche-block"><div class="fiche-section-eyebrow">${lb.fam}</div><ul class="fiche-ul">${famille.map(i=>`<li>${i}</li>`).join('')}</ul></div>`:''}
      ${pastoral.length?`<div class="fiche-block"><div class="fiche-section-eyebrow">${lb.past}</div><ul class="fiche-ul">${pastoral.map(i=>`<li>${i}</li>`).join('')}</ul></div>`:''}
      ${eglise.length?`<div class="fiche-block"><div class="fiche-section-eyebrow">${lb.egl}</div><ul class="fiche-link-list">${eglise.map(r=>`<li class="fiche-link-item"><a href="${r.url}" target="_blank" rel="noopener">${svgExtLink(12)} ${r.label}</a></li>`).join('')}</ul></div>`:''}
      ${communaute.length?`<div class="fiche-block"><div class="fiche-section-eyebrow">${lb.com}</div><ul class="fiche-link-list">${communaute.map(r=>r.url?`<li class="fiche-link-item"><a href="${r.url}" target="_blank" rel="noopener">${svgExtLink(12)} ${r.label}</a></li>`:`<li class="fiche-link-item"><span style="font-size:13px;color:var(--c-muted);padding:8px 12px;display:block">— ${r.label}</span></li>`).join('')}</ul></div>`:''}
    </div>`;

  overlay.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeFiche() {
  const overlay=document.getElementById('fiche-overlay');
  if(overlay) overlay.classList.remove('open');
  document.body.style.overflow='';
}
window.closeFiche=closeFiche;

/* NAV */
function initNav() {
  const nav=document.getElementById('nav');
  window.addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled',window.scrollY>40);
    const sections=['ressources','pastoral','dirigeants','organisations'];
    const cur=sections.find(s=>{ const e=document.getElementById(s); if(!e) return false; const r=e.getBoundingClientRect(); return r.top<=100&&r.bottom>100; });
    document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
  });
  const hb=document.getElementById('hamburger'), mob=document.getElementById('mobile-nav');
  if(hb&&mob) hb.addEventListener('click',()=>mob.classList.toggle('open'));
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  document.querySelectorAll('.back-top-btn').forEach(b=>b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'})));
  const sc=document.getElementById('hero-scroll-cue');
  if(sc) sc.addEventListener('click',()=>document.getElementById('ressources')?.scrollIntoView({behavior:'smooth'}));
}

let _scrollObs = null;
function initScrollEffects() {
  if (_scrollObs) _scrollObs.disconnect();
  _scrollObs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => _scrollObs.observe(el));
}

function initDirTabs() {
  document.querySelectorAll('.dir-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.dir-tab').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.dir-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.panel)?.classList.add('active');
    });
  });
}

/* UTILS */
function setEl(id,txt){ const e=document.getElementById(id); if(e) e.textContent=txt; }
function truncate(s,n){ return s&&s.length>n?s.slice(0,n).trim()+'…':s||''; }

/* ICONS — inline SVG */
const S=(d,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const svgBook=s=>S('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',s);
const svgHeart=s=>S('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',s);
const svgUsers=s=>S('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',s);
const svgSettings=s=>S('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',s);
const svgStar=s=>S('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',s);
const svgTrend=s=>S('<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',s);
const svgCal=s=>S('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',s);
const svgMail=s=>S('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',s);
const svgGlobe=s=>S('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',s);
const svgDb=s=>S('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',s);
const svgVideo=s=>S('<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',s);
const svgFile=s=>S('<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>',s);
const svgTarget=s=>S('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',s);
const svgChev=s=>S('<polyline points="9 18 15 12 9 6"/>',s);
const svgExtLink=s=>S('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',s);
