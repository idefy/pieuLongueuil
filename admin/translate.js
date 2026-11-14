/* Outil de traduction FR → ES/EN (admin/translate.html)
   Logique pure (testable) + interface. Aucune dépendance. */
(function (root) {
  'use strict';
  var REPO = 'idefy/pieuLongueuil', BRANCH = 'main';
  var LANGS = ['es', 'en'];

  /* ---------- Détection des textes à traduire ---------- */
  // alt : le schéma du CMS n'a pas de champs alt_es / alt_en pour les images de sous-pages
  var SKIP_BASE = /(href|url|src|image|icon|slug|id|color|alt)$/i;
  function hasText(v) { return typeof v === 'string' && v.trim() !== ''; }
  function looksLikeLink(v) {
    return /^(https?:\/\/|\/|modal:|#|mailto:|tel:)/i.test(v.trim()) || /\.(jpe?g|png|webp|gif|svg|pdf)$/i.test(v.trim());
  }

  function findCandidates(rootNode) {
    var out = [];
    (function walk(node, path, ctx) {
      if (Array.isArray(node)) {
        node.forEach(function (n, i) { walk(n, path.concat(i), ctx); });
        return;
      }
      if (!node || typeof node !== 'object') return;
      var keys = Object.keys(node);
      var type = typeof node.type === 'string' ? node.type : ctx;

      // Objet { fr, es, en }
      if (hasText(node.fr) && keys.every(function (k) { return k === 'fr' || k === 'es' || k === 'en'; })) {
        var need = LANGS.filter(function (l) { return !hasText(node[l]); });
        if (need.length) out.push({ kind: 'obj', path: path, base: '', fr: node.fr, need: need, ctx: ctx || '' });
        return;
      }

      // Champs *_fr (les hymnes ont des titres officiels propres à chaque langue : on les saute)
      if (node.type !== 'hymn') {
        keys.forEach(function (k) {
          var m = /^(.+)_fr$/.exec(k);
          if (!m || !hasText(node[k])) return;
          var base = m[1];
          if (SKIP_BASE.test(base) || looksLikeLink(node[k])) return;
          var need = LANGS.filter(function (l) { return !hasText(node[base + '_' + l]); });
          if (need.length) out.push({ kind: 'suffix', path: path, base: base, fr: node[k], need: need, ctx: type || '' });
        });
      }
      keys.forEach(function (k) { walk(node[k], path.concat(k), type); });
    })(rootNode, [], '');
    return out;
  }

  function getNode(rootNode, path) {
    var n = rootNode;
    for (var i = 0; i < path.length; i++) {
      if (n == null) return null;
      n = n[path[i]];
    }
    return n && typeof n === 'object' ? n : null;
  }

  function insertAfter(obj, afterKey, key, val) {
    var entries = Object.keys(obj).map(function (k) { return [k, obj[k]]; });
    entries.forEach(function (e) { delete obj[e[0]]; });
    var done = false;
    entries.forEach(function (e) {
      if (e[0] === key) return;
      obj[e[0]] = e[1];
      if (e[0] === afterKey) { obj[key] = val; done = true; }
    });
    if (!done) obj[key] = val;
  }

  /* Applique une traduction ; ne remplace jamais un texte déjà présent.
     Retourne true si appliqué. */
  function applyTranslation(rootNode, cand, lang, text) {
    var node = getNode(rootNode, cand.path);
    if (!node) return false;
    var key = cand.kind === 'obj' ? lang : cand.base + '_' + lang;
    var frKey = cand.kind === 'obj' ? 'fr' : cand.base + '_fr';
    if (node[frKey] !== cand.fr) return false;          // le texte français a changé entre-temps
    if (hasText(node[key])) return false;               // quelqu'un a déjà traduit
    if (Object.prototype.hasOwnProperty.call(node, key)) { node[key] = text; return true; }
    var after = lang === 'en' && Object.prototype.hasOwnProperty.call(node, cand.kind === 'obj' ? 'es' : cand.base + '_es')
      ? (cand.kind === 'obj' ? 'es' : cand.base + '_es') : frKey;
    insertAfter(node, after, key, text);
    return true;
  }

  /* ---------- Vérifications ---------- */
  var STATIC_TERMS = [
    { fr: 'Église de Jésus-Christ des Saints des Derniers Jours', es: 'Iglesia de Jesucristo de los Santos de los Últimos Días', en: 'Church of Jesus Christ of Latter-day Saints' },
    { fr: 'Collège des anciens', es: 'Cuórum de Élderes', en: 'Elders Quorum' },
    { fr: 'Livre de Mormon', es: 'Libro de Mormón', en: 'Book of Mormon' },
    { fr: 'Sainte-Cène', es: 'Santa Cena', en: 'Sacrament' },
    { fr: 'Pieu', es: 'Estaca', en: 'Stake' },
    { fr: 'Paroisse', es: 'Barrio', en: 'Ward' },
    { fr: 'Évêque', es: 'Obispo', en: 'Bishop' }
  ];
  var ORG_KEYS = ['org_presidence', 'org_grandconseil', 'org_ss', 'org_jf', 'org_jg', 'org_primaire', 'org_ecole', 'org_jas'];

  function buildGlossary(orgJson) {
    var terms = STATIC_TERMS.slice();
    if (orgJson) ORG_KEYS.forEach(function (k) {
      var e = orgJson[k];
      if (e && e.fr && e.es && e.en) terms.push({ fr: e.fr, es: e.es, en: e.en });
    });
    return terms;
  }
  function termRegex(term) {
    var esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(^|[^a-zà-ÿ])' + esc + '(?:s|x)?(?![a-zà-ÿ])', 'i');
  }
  function warnings(fr, lang, out, glossary) {
    var w = [];
    (glossary || []).forEach(function (t) {
      if (termRegex(t.fr).test(fr) && out.toLowerCase().indexOf(t[lang].toLowerCase()) === -1) {
        w.push('Terme à vérifier : « ' + t.fr + ' » → « ' + t[lang] + ' »');
      }
    });
    var count = function (s, re) { return (s.match(re) || []).length; };
    if (count(fr, /\*\*/g) !== count(out, /\*\*/g)) w.push('Le gras (**) ne correspond pas au texte français');
    if (count(fr, /\]\(/g) !== count(out, /\]\(/g)) w.push('Les liens ne correspondent pas au texte français');
    if (count(fr, /\n/g) !== count(out, /\n/g)) w.push('Les sauts de ligne ne correspondent pas');
    return w;
  }

  /* ---------- JSON <-> GitHub ---------- */
  function detectIndent(raw) {
    var m = /\n([ \t]+)"/.exec(raw);
    return m ? m[1] : '  ';
  }
  function serialize(obj, raw) {
    return JSON.stringify(obj, null, detectIndent(raw)) + (/\n$/.test(raw) ? '\n' : '');
  }
  function b64decode(b64) {
    var bin = atob(b64.replace(/\s/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }
  function b64encode(text) {
    var bytes = new TextEncoder().encode(text), bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  var api = {
    findCandidates: findCandidates, applyTranslation: applyTranslation, buildGlossary: buildGlossary,
    warnings: warnings, serialize: serialize, b64decode: b64decode, b64encode: b64encode, getNode: getNode
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PieuTranslate = api;

  /* ---------- Interface ---------- */
  if (typeof document === 'undefined' || !document.getElementById('tt-app')) return;

  var $ = function (id) { return document.getElementById(id); };
  var token = null, glossary = buildGlossary(null);
  var current = null; // { path, sha, raw, data, rows:[…] }

  function setStatus(msg, kind) {
    var el = $('tt-status'); el.textContent = msg || ''; el.className = kind || '';
  }
  function gh(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({ Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' }, opts.headers || {});
    return fetch('https://api.github.com/repos/' + REPO + path, opts).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error('GitHub ' + r.status + ' : ' + t.slice(0, 160)); });
      return r.json();
    });
  }
  function getFile(path) {
    return gh('/contents/' + path.split('/').map(encodeURIComponent).join('/') + '?ref=' + BRANCH).then(function (f) {
      var raw = b64decode(f.content);
      return { path: path, sha: f.sha, raw: raw, data: JSON.parse(raw) };
    });
  }

  function login() {
    setStatus('Ouverture de la fenêtre de connexion GitHub…');
    var w = window.open('/api/auth', 'pieu-auth', 'width=600,height=720');
    if (!w) { setStatus('La fenêtre de connexion a été bloquée : autoriser les fenêtres contextuelles pour ce site.', 'err'); return; }
    function onMsg(e) {
      if (e.source !== w || e.origin !== location.origin) return;
      if (e.data === 'authorizing:github') { w.postMessage('authorizing:github', e.origin); return; }
      var ok = /^authorization:github:success:(.*)$/.exec(String(e.data));
      if (ok) {
        window.removeEventListener('message', onMsg);
        try { token = JSON.parse(ok[1]).token; } catch (x) { token = null; }
        if (token) { sessionStorage.setItem('pieu-tt-token', token); afterLogin(); }
        return;
      }
      if (/^authorization:github:error:/.test(String(e.data))) {
        window.removeEventListener('message', onMsg);
        setStatus('Connexion refusée.', 'err');
      }
    }
    window.addEventListener('message', onMsg);
  }

  function afterLogin() {
    $('tt-login').hidden = true; $('tt-main').hidden = false;
    setStatus('Chargement de la liste des fichiers…');
    fetch('/data/i18n/org.json').then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { glossary = buildGlossary(j); }).catch(function () {});
    Promise.all([gh('/contents/data/pages?ref=' + BRANCH), gh('/contents/data/modals?ref=' + BRANCH)]).then(function (res) {
      var sel = $('tt-file'); sel.textContent = '';
      var groups = [
        ['Sous-pages', res[0].filter(function (f) { return /\.json$/.test(f.name); }).map(function (f) { return f.path; })],
        ['Fenêtres (modals)', res[1].filter(function (f) { return /\.json$/.test(f.name); }).map(function (f) { return f.path; })],
        ['Autres', ['data/conference.json', 'data/member-resources.json']]
      ];
      groups.forEach(function (g) {
        var og = document.createElement('optgroup'); og.label = g[0];
        g[1].forEach(function (p) { var o = document.createElement('option'); o.value = p; o.textContent = p.replace('data/', ''); og.appendChild(o); });
        sel.appendChild(og);
      });
      setStatus('');
    }).catch(function (e) {
      sessionStorage.removeItem('pieu-tt-token'); token = null;
      $('tt-login').hidden = false; $('tt-main').hidden = true;
      setStatus('Connexion invalide ou accès refusé (' + e.message + '). Se reconnecter.', 'err');
    });
  }

  function analyse() {
    var path = $('tt-file').value;
    setStatus('Analyse de ' + path + '…'); $('tt-rows').textContent = ''; $('tt-actions').hidden = true;
    getFile(path).then(function (f) {
      var cands = findCandidates(f.data);
      current = { path: path, sha: f.sha, raw: f.raw, data: f.data, rows: cands.map(function (c) { return { c: c, es: '', en: '', warn: [], on: true }; }) };
      if (!cands.length) { setStatus('Rien à traduire : tous les textes français ont déjà un équivalent ES et EN.', 'ok'); return; }
      var chars = cands.reduce(function (n, c) { return n + c.fr.length * c.need.length; }, 0);
      renderRows();
      $('tt-translate').textContent = 'Traduire ' + cands.length + ' texte(s) (' + chars + ' caractères)';
      $('tt-translate').hidden = false; $('tt-publish').hidden = true; $('tt-actions').hidden = false;
      setStatus(cands.length + ' texte(s) sans traduction complète. Cliquer sur « Traduire » pour obtenir des propositions.');
    }).catch(function (e) { setStatus('Erreur : ' + e.message, 'err'); });
  }

  function mk(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function renderRows() {
    var body = $('tt-rows'); body.textContent = '';
    current.rows.forEach(function (r, i) {
      var tr = mk('tr');
      var td0 = mk('td'); var cb = mk('input'); cb.type = 'checkbox'; cb.checked = r.on;
      cb.addEventListener('change', function () { r.on = cb.checked; }); td0.appendChild(cb); tr.appendChild(td0);
      var tdC = mk('td', 'ctx', (r.c.ctx ? r.c.ctx + ' · ' : '') + (r.c.base || r.c.path[r.c.path.length - 1] || ''));
      tr.appendChild(tdC);
      tr.appendChild(mk('td', 'fr', r.c.fr));
      LANGS.forEach(function (l) {
        var td = mk('td');
        if (r.c.need.indexOf(l) === -1) { td.appendChild(mk('span', 'muted', '(déjà traduit)')); }
        else {
          var ta = mk('textarea'); ta.value = r[l]; ta.rows = Math.min(8, Math.max(2, Math.ceil(r.c.fr.length / 40)));
          ta.addEventListener('input', function () { r[l] = ta.value; });
          td.appendChild(ta);
          (r.warn[l] || []).forEach(function (w) { td.appendChild(mk('div', 'warn', '⚠ ' + w)); });
        }
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  function translateAll() {
    var btn = $('tt-translate'); btn.disabled = true; setStatus('Traduction en cours…');
    var jobs = [];
    LANGS.forEach(function (l) {
      var idx = []; current.rows.forEach(function (r, i) { if (r.c.need.indexOf(l) !== -1) idx.push(i); });
      for (var s = 0; s < idx.length; s += 40) jobs.push({ l: l, idx: idx.slice(s, s + 40) });
    });
    var chain = Promise.resolve();
    jobs.forEach(function (j) {
      chain = chain.then(function () {
        return fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ target: j.l, texts: j.idx.map(function (i) { return current.rows[i].c.fr; }) })
        }).then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || ('Erreur ' + r.status)); return d; }); })
          .then(function (d) {
            j.idx.forEach(function (i, k) {
              var row = current.rows[i]; row[j.l] = d.translations[k];
              if (!Array.isArray(row.warn)) row.warn = {};
              row.warn[j.l] = warnings(row.c.fr, j.l, row[j.l], glossary);
            });
          });
      });
    });
    chain.then(function () {
      renderRows(); btn.disabled = false; $('tt-publish').hidden = false;
      setStatus('Propositions prêtes : relire, corriger si besoin, décocher ce qu\'il ne faut pas publier, puis publier.', 'ok');
    }).catch(function (e) { btn.disabled = false; setStatus('Erreur de traduction : ' + e.message, 'err'); });
  }

  function publish() {
    var btn = $('tt-publish'); btn.disabled = true; setStatus('Publication…');
    getFile(current.path).then(function (f) {          // dernière version du fichier
      var applied = 0, skipped = 0;
      current.rows.forEach(function (r) {
        if (!r.on) return;
        r.c.need.forEach(function (l) {
          if (!hasText(r[l])) return;
          if (applyTranslation(f.data, r.c, l, r[l].trim())) applied++; else skipped++;
        });
      });
      if (!applied) { throw new Error('Aucune modification applicable (' + skipped + ' ignorée(s) : texte changé entre-temps ?).'); }
      return gh('/contents/' + current.path.split('/').map(encodeURIComponent).join('/'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Traduction automatique de "' + current.path.replace('data/', '') + '" par le CMS',
          content: b64encode(serialize(f.data, f.raw)), sha: f.sha, branch: BRANCH
        })
      }).then(function () { return { applied: applied, skipped: skipped }; });
    }).then(function (res) {
      btn.disabled = false; $('tt-actions').hidden = true; $('tt-rows').textContent = '';
      setStatus('Publié : ' + res.applied + ' traduction(s)' + (res.skipped ? ', ' + res.skipped + ' ignorée(s)' : '') + '. Le site se met à jour dans environ une minute.', 'ok');
    }).catch(function (e) { btn.disabled = false; setStatus('Erreur : ' + e.message, 'err'); });
  }

  $('tt-login-btn').addEventListener('click', login);
  $('tt-analyse').addEventListener('click', analyse);
  $('tt-translate').addEventListener('click', translateAll);
  $('tt-publish').addEventListener('click', publish);
  var saved = sessionStorage.getItem('pieu-tt-token');
  if (saved) { token = saved; afterLogin(); }
})(typeof window !== 'undefined' ? window : globalThis);
