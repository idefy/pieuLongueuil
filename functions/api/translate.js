/**
 * /api/translate — Machine translation (Google Cloud Translation, Basic v2)
 * Cloudflare Pages Function. Used by /admin/translate.html.
 *
 * POST JSON { target: "es"|"en", texts: ["…", …] }  (source language is always French)
 * Header   Authorization: Bearer <GitHub token of the logged-in editor>
 * Reply    { translations: ["…", …] }
 *
 * Env var (Cloudflare Pages → Settings → Variables): GOOGLE_TRANSLATE_API_KEY
 * Only GitHub users with Write access to the repo may call it (protects the quota).
 */
const REPO = 'idefy/pieuLongueuil';
const MAX_ITEMS = 80;
const MAX_CHARS = 20000;

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Cache-Control': 'no-store' },
  });
}

/* Inline markdown (**bold**, *italic*, [text](url), newlines) <-> HTML, so that
   Google keeps the markup and does not touch URLs. */
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
function mdToHtml(md) {
  let s = escHtml(md);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  s = s.replace(/\*([^*\n]+)\*/g, '<i>$1</i>');
  return s.replace(/\r?\n/g, '<br>');
}
function htmlToMd(html) {
  let s = html;
  s = s.replace(/<a\s+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  s = s.replace(/<(b|strong)>([\s\S]*?)<\/\1>/gi, '**$2**');
  s = s.replace(/<(i|em)>([\s\S]*?)<\/\1>/gi, '*$2*');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/?[a-z][^>]*>/gi, '');   // any other tag Google may add
  return decodeEntities(s).replace(/ *\n */g, '\n').trim();
}

async function isEditor(token) {
  const r = await fetch('https://api.github.com/repos/' + REPO, {
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'pieulongueuil-translate',
    },
  });
  if (!r.ok) return false;
  const repo = await r.json();
  return !!(repo.permissions && repo.permissions.push);
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return json({ error: 'Connexion requise' }, 401);
  try {
    if (!(await isEditor(token))) return json({ error: 'Accès refusé' }, 403);
  } catch (e) {
    return json({ error: 'Vérification GitHub impossible' }, 502);
  }

  if (!env.GOOGLE_TRANSLATE_API_KEY) {
    return json({ error: 'GOOGLE_TRANSLATE_API_KEY n\'est pas configurée dans Cloudflare Pages' }, 503);
  }

  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'JSON invalide' }, 400); }
  const target = body && body.target;
  const texts = body && body.texts;
  if (!['es', 'en'].includes(target)) return json({ error: 'Langue cible invalide' }, 400);
  if (!Array.isArray(texts) || !texts.length || texts.length > MAX_ITEMS ||
      !texts.every((t) => typeof t === 'string' && t.trim())) {
    return json({ error: 'Liste de textes invalide' }, 400);
  }
  if (texts.reduce((n, t) => n + t.length, 0) > MAX_CHARS) {
    return json({ error: 'Trop de texte pour une requête' }, 413);
  }

  const res = await fetch(
    'https://translation.googleapis.com/language/translate/v2?key=' + encodeURIComponent(env.GOOGLE_TRANSLATE_API_KEY),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: texts.map(mdToHtml), source: 'fr', target, format: 'html' }),
    }
  );
  const data = await res.json().catch(() => null);
  if (!res.ok || !data || !data.data || !Array.isArray(data.data.translations)) {
    const msg = data && data.error && data.error.message ? data.error.message : 'Erreur du service de traduction';
    return json({ error: msg }, 502);
  }
  return json({ translations: data.data.translations.map((t) => htmlToMd(t.translatedText || '')) });
}
