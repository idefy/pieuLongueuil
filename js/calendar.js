/**
 * CALENDAR — "Calendrier de l'Église" block
 * ==========================================
 * Used by the sub-pages (page.js) and the conference page.
 *
 * What it does (reuses the digital-board POC logic):
 *   1. Fetches the iCal feed through the Cloudflare proxy (browsers can't read it directly).
 *   2. Drops past events (anything before today), sorts by date, keeps the first N.
 *   3. Shows title, date/time, location (if any) and a link to the event page.
 *   4. In the background, reads each event page for its flyer image (.Hero img, then og:image)
 *      and slides it into the list when found.
 *
 * Wiring (sub-pages): load this script AFTER js/page.js in page.html. It adds the "calendar"
 * type to page.js's global renderSection() without touching page.js. If renderSection() is not
 * a global function, nothing is changed and the block simply doesn't show.
 * Wiring (conference.html): its own renderer calls PieuCalendar.block(section, lang).
 * Either way the placeholders are filled in by themselves (MutationObserver), including after
 * a language change re-renders the page.
 */
(function () {
  'use strict';

  var CONFIG = {
    proxy: 'https://white-sun-144.idefaye.workers.dev/',   // Cloudflare worker used by the digital-board POC
    timeZone: 'America/Toronto',                           // events are shown in local (Québec) time
    maxEvents: 20
  };

  var L10N = {
    fr: { loading: 'Chargement du calendrier…', empty: 'Aucune activité à venir.', error: 'Calendrier non disponible pour le moment.', view: "Voir l'activité", locale: 'fr-CA' },
    es: { loading: 'Cargando el calendario…',   empty: 'No hay actividades próximas.', error: 'Calendario no disponible por el momento.', view: 'Ver la actividad', locale: 'es-MX' },
    en: { loading: 'Loading calendar…',         empty: 'No upcoming events.',           error: 'Calendar not available at this time.',     view: 'View event',       locale: 'en-CA' }
  };

  /* ── Helpers ──────────────────────────────────────────── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function safeHttp(u) { return /^https?:\/\//i.test(String(u || '').trim()); }
  function isChurchPage(u) { return /^https:\/\/([a-z0-9-]+\.)*churchofjesuschrist\.org\//i.test(String(u || '')); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ── Time zones ───────────────────────────────────────── */
  function tzOffsetMs(utcMs, tz) {
    var p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      .formatToParts(new Date(utcMs)).forEach(function (x) { p[x.type] = x.value; });
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - utcMs;
  }
  /* wall-clock time in a time zone → real instant */
  function zonedToDate(y, mo, d, h, mi, s, tz) {
    var guess = Date.UTC(y, mo, d, h, mi, s);
    var t = guess - tzOffsetMs(guess, tz);
    return new Date(guess - tzOffsetMs(t, tz));
  }
  /* YYYY-MM-DD of an instant, in the site's time zone */
  function dayKeyOf(date) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: CONFIG.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }

  /* ── iCal parsing ─────────────────────────────────────── */
  function unescapeText(s) {
    return String(s).replace(/\\(.)/g, function (m, c) { return (c === 'n' || c === 'N') ? ' ' : c; });
  }

  function parseStart(val, params) {
    var m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(String(val).trim());
    if (!m) return null;
    var y = +m[1], mo = +m[2] - 1, d = +m[3];
    if (m[4] === undefined || String(params.VALUE || '').toUpperCase() === 'DATE') {
      return { allDay: true, dayKey: m[1] + '-' + m[2] + '-' + m[3], start: new Date(Date.UTC(y, mo, d, 12)) };
    }
    var h = +m[4], mi = +m[5], s = +(m[6] || 0), date;
    if (m[7]) {
      date = new Date(Date.UTC(y, mo, d, h, mi, s));
    } else {
      try { date = zonedToDate(y, mo, d, h, mi, s, params.TZID || CONFIG.timeZone); }
      catch (e) { date = zonedToDate(y, mo, d, h, mi, s, CONFIG.timeZone); }
    }
    return { allDay: false, dayKey: dayKeyOf(date), start: date };
  }

  function parseICS(text) {
    var lines = String(text).replace(/\r?\n[ \t]/g, '').split(/\r?\n/);   // unfold continuation lines
    var events = [], cur = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line === 'BEGIN:VEVENT') { cur = {}; continue; }
      if (line === 'END:VEVENT') {
        if (cur && cur.title && cur.start) events.push(cur);
        cur = null; continue;
      }
      if (!cur) continue;
      var idx = line.indexOf(':');
      if (idx < 1) continue;
      var key = line.slice(0, idx), val = line.slice(idx + 1);
      var parts = key.split(';'), name = parts[0].toUpperCase(), params = {};
      parts.slice(1).forEach(function (p) { var eq = p.indexOf('='); if (eq > 0) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1); });

      if (name === 'SUMMARY') cur.title = unescapeText(val).trim();
      else if (name === 'LOCATION') cur.location = unescapeText(val).trim();
      else if (name === 'URL') { var u = val.trim(); if (safeHttp(u)) cur.url = u; }
      else if (name === 'DTSTART') {
        var st = parseStart(val, params);
        if (st) { cur.allDay = st.allDay; cur.dayKey = st.dayKey; cur.start = st.start; }
      }
    }
    return events;
  }

  /* ── Fetching (through the proxy, cached per URL) ─────── */
  var cache = {};
  function getText(url) {
    if (!cache[url]) {
      cache[url] = fetch(CONFIG.proxy + '?url=' + encodeURIComponent(url)).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      });
      cache[url].catch(function () { delete cache[url]; });
    }
    return cache[url];
  }

  /* flyer image of an event page: .Hero img first, then og:image */
  function findImage(html, base) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var img = doc.querySelector('.Hero img');
    var src = img && (img.getAttribute('src') || img.getAttribute('data-src'));
    if (!src) { var og = doc.querySelector('meta[property="og:image"]'); src = og && og.getAttribute('content'); }
    if (!src) return '';
    try { var abs = new URL(src, base).href; return safeHttp(abs) ? abs : ''; } catch (e) { return ''; }
  }

  /* ── Rendering ────────────────────────────────────────── */
  function ico(inner) {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  var ICON_CAL = ico('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>');
  var ICON_PIN = ico('<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>');

  function formatWhen(evt, lang) {
    var opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (evt.allDay) { opts.timeZone = 'UTC'; }
    else { opts.hour = '2-digit'; opts.minute = '2-digit'; opts.timeZone = CONFIG.timeZone; }
    var s = new Intl.DateTimeFormat(L10N[lang].locale, opts).format(evt.start);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function itemHtml(evt, lang) {
    var link = evt.url ? '<a class="sp-cal-link" href="' + esc(evt.url) + '" target="_blank" rel="noopener">' + esc(L10N[lang].view) + ' ↗</a>' : '';
    var where = evt.location ? '<p class="sp-cal-meta">' + ICON_PIN + '<span>' + esc(evt.location.replace(/\s*\/\s*/g, ', ')) + '</span></p>' : '';
    return '<article class="sp-cal-item"><div class="sp-cal-body">' +
           '<h3 class="sp-cal-title">' + esc(evt.title) + '</h3>' +
           '<p class="sp-cal-meta">' + ICON_CAL + '<span>' + esc(formatWhen(evt, lang)) + '</span></p>' +
           where + link + '</div></article>';
  }

  function addImage(root, evt, index) {
    if (!evt.url || !isChurchPage(evt.url)) return;
    getText(evt.url).then(function (html) {
      var src = findImage(html, evt.url);
      var item = root.querySelectorAll('.sp-cal-item')[index];
      if (!src || !item) return;
      item.insertAdjacentHTML('afterbegin', '<div class="sp-cal-img"><img loading="lazy" alt="" src="' + esc(src) + '"></div>');
      item.querySelector('img').onerror = function () { var box = this.parentNode; if (box && box.parentNode) box.parentNode.removeChild(box); };
    }).catch(function () { /* no image: the event is still listed */ });
  }

  function hydrate(el) {
    if (el.getAttribute('data-ready')) return;
    el.setAttribute('data-ready', '1');
    var lang = window.currentLang || 'fr';
    if (!L10N[lang]) lang = 'fr';
    var url = el.getAttribute('data-url') || '';
    var count = Math.min(Math.max(parseInt(el.getAttribute('data-count'), 10) || 5, 1), CONFIG.maxEvents);
    var withImages = el.getAttribute('data-images') !== '0';
    var title = el.getAttribute('data-title') || '';
    var head = title ? '<h2 class="sp-cal-heading">' + esc(title) + '</h2>' : '';
    function state(msg) { el.innerHTML = head + '<p class="sp-cal-state">' + esc(msg) + '</p>'; }

    state(L10N[lang].loading);
    if (!safeHttp(url)) { state(L10N[lang].error); return; }

    getText(url).then(function (text) {
      var today = dayKeyOf(new Date());
      var events = parseICS(text)
        .filter(function (e) { return e.dayKey >= today; })                       // ignore past events
        .sort(function (a, b) {
          if (a.dayKey !== b.dayKey) return a.dayKey < b.dayKey ? -1 : 1;
          if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;                    // all-day first
          return a.start - b.start;
        })
        .slice(0, count);
      if (!events.length) { state(L10N[lang].empty); return; }
      el.innerHTML = head + '<div class="sp-cal-list">' + events.map(function (e) { return itemHtml(e, lang); }).join('') + '</div>';
      if (withImages) events.forEach(function (e, i) { addImage(el, e, i); });
    }).catch(function () { state(L10N[lang].error); });
  }

  /* placeholder returned by renderSection(); hydrated automatically */
  function block(s, lang) {
    var title = s['title_' + lang] || s.title_fr || '';
    return '<div class="sp-calendar" data-url="' + esc(s.url) + '" data-count="' + esc(s.count || 5) + '" data-images="' + (s.show_images === false ? '0' : '1') + '" data-title="' + esc(title) + '"></div>';
  }

  /* ── Styles + auto-hydration ──────────────────────────── */
  var CSS =
    '.sp-calendar{margin:24px 0}' +
    '.sp-cal-heading{font-family:var(--font-display,Georgia,serif);font-size:26px;font-weight:700;color:var(--c-dark,#0D1F3C);margin:0 0 14px;padding-bottom:10px;border-bottom:1px solid var(--c-border,#E4DDD4)}' +
    '.sp-cal-list{display:flex;flex-direction:column;gap:14px}' +
    '.sp-cal-item{display:flex;gap:18px;align-items:flex-start;background:var(--c-surface,#fff);border:1px solid var(--c-border,#E4DDD4);border-radius:6px;padding:16px}' +
    '.sp-cal-img{flex:0 0 190px;max-width:40%}' +
    '.sp-cal-img img{width:100%;height:auto;display:block;border-radius:4px;border:1px solid var(--c-border,#E4DDD4)}' +
    '.sp-cal-body{min-width:0;flex:1}' +
    '.sp-cal-title{font-family:var(--font-display,Georgia,serif);font-size:19px;font-weight:700;color:var(--c-dark,#0D1F3C);margin:0 0 8px;line-height:1.25}' +
    '.sp-cal-meta{display:flex;align-items:flex-start;gap:8px;font-size:14px;color:var(--c-muted,#6B6460);margin:3px 0;line-height:1.5}' +
    '.sp-cal-meta svg{flex-shrink:0;color:var(--c-secondary,#B8924A);margin-top:3px}' +
    '.sp-cal-link{display:inline-block;margin-top:10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--c-accent,#2C5F9E);text-decoration:none}' +
    '.sp-cal-link:hover{color:var(--c-secondary,#B8924A)}' +
    '.sp-cal-state{font-style:italic;color:var(--c-muted,#6B6460);font-size:14px;padding:8px 0;margin:0}' +
    '@media(max-width:600px){.sp-cal-item{flex-direction:column}.sp-cal-img{flex-basis:auto;max-width:100%;width:100%}}';

  function scan() {
    var els = document.querySelectorAll('.sp-calendar:not([data-ready])');
    for (var i = 0; i < els.length; i++) hydrate(els[i]);
  }
  function start() {
    var st = document.createElement('style');
    st.id = 'pieu-calendar-css';
    st.textContent = CSS;
    document.head.appendChild(st);
    scan();
    if (window.MutationObserver) new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  }
  /* sub-pages: teach page.js's global renderSection() the "calendar" type (page.js is loaded first) */
  if (typeof window.renderSection === 'function' && !window.renderSection.__pieuCal) {
    var original = window.renderSection;
    var wrapped = function (s, lang) {
      if (s && s.type === 'calendar') return block(s, lang);
      return original.apply(this, arguments);
    };
    wrapped.__pieuCal = true;
    window.renderSection = wrapped;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.PieuCalendar = { block: block, hydrate: hydrate, parseICS: parseICS, dayKeyOf: dayKeyOf, config: CONFIG };
})();
