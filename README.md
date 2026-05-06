# Site Pieu Longueuil — Guide d'administration

## Structure des fichiers

```
pieu-longueuil/
├── index.html          ← Page principale (ne pas modifier)
├── conference.html     ← Programme de conférence (QR code)
├── css/
│   └── main.css        ← Styles (ne pas modifier directement)
├── js/
│   ├── config.js       ★ CONFIGURATION PRINCIPALE — modifier ici
│   ├── i18n.js         ★ TRADUCTIONS — modifier ici
│   └── app.js          ← Logique de l'application
├── data/
│   ├── leaders.json    ★ DIRIGEANTS — modifier ici
│   └── resources.json  ★ RESSOURCES/GUIDES — modifier ici
└── assets/
    ├── chapel.jpg      ← Photo de la chapelle
    └── leaders/        ← Photos des dirigeants
        └── placeholder.jpg
```

---

## Changer les couleurs / polices / nom

Ouvrez `js/config.js` et modifiez la section `colors` ou `fonts`.
Les changements s'appliquent automatiquement sur toutes les pages.

```js
colors: {
  primary:   "#1B3A6B",   // Bleu marine principal
  secondary: "#B8924A",   // Or — accents, soulignements
  // ...
}
```

---

## Mettre à jour un dirigeant

Ouvrez `data/leaders.json`. Chaque entrée ressemble à ceci :

```json
{
  "id": "president-pieu",
  "org": "presidence",
  "role": {
    "fr": "Président de Pieu",
    "es": "Presidente de Estaca",
    "en": "Stake President"
  },
  "name": "Prénom Nom",
  "photo": "assets/leaders/nom-photo.jpg",
  "active": true
}
```

- Changer `"name"` pour mettre à jour le nom.
- Changer `"photo"` pour pointer vers la nouvelle photo dans `assets/leaders/`.
- Mettre `"active": false` pour masquer un dirigeant sans le supprimer.

**Organisations disponibles :** `presidence`, `grandconseil`, `ss`, `jf`, `jg`, `primaire`, `ecole`

---

## Ajouter un guide ou document pour les dirigeants

Ouvrez `data/resources.json` et ajoutez une entrée :

```json
{
  "id": "mon-nouveau-guide",
  "section": "dirigeants",
  "category": "guides",
  "type": "guide",
  "lang": ["fr"],
  "title": {
    "fr": "Titre du guide",
    "es": "Título de la guía",
    "en": "Guide title"
  },
  "description": {
    "fr": "Description courte du guide.",
    "es": "Descripción corta.",
    "en": "Short description."
  },
  "url": "https://lien-vers-le-document.com",
  "icon": "file",
  "external": true,
  "active": true
}
```

**Valeurs de `section`:** `dirigeants`, `pastoral`
**Valeurs de `category`:** `vision`, `guides`, `tutoriels`, `officiel`, `fiches`
**Valeurs de `type`:** `guide`, `processus`, `information`, `video`, `formation`, `rapport`
**Valeurs de `icon`:** `book`, `heart`, `users`, `star`, `globe`, `calendar`, `settings`, `trendingUp`, `video`, `file`, `target`, `database`

---

## Mettre à jour la conférence de pieu

Ouvrez `conference.html` et modifiez directement les entrées HTML dans la section
marquée `CONTENU DE LA CONFÉRENCE`. Le format est simple :

```html
<div class="conf-item">
  <div class="conf-time">10:15</div>
  <div class="conf-item-content">
    <div class="conf-item-title">Discours</div>
    <div class="conf-item-detail">Frère Martin Dupont</div>
  </div>
</div>
```

Le lien QR code pointe vers : `https://votre-domaine.com/conference.html`
Cette page n'est pas dans le menu — elle est accessible uniquement via QR code.

---

## Ajouter une traduction ou corriger un texte

Ouvrez `js/i18n.js`. Chaque langue est un objet avec des clés :

```js
fr: {
  nav_ressources: "Ressources",
  // ...
},
es: {
  nav_ressources: "Recursos",
  // ...
}
```

Ajoutez la clé dans les trois langues pour qu'elle s'affiche dans toutes les langues.

---

## Déploiement

Ce site est 100% statique. Il peut être hébergé sur :
- **GitHub Pages** (gratuit) — pousser les fichiers dans un repo public
- **Netlify** (gratuit) — glisser-déposer le dossier
- **Tout hébergeur web** supportant les fichiers statiques

⚠️ Le chargement des fichiers JSON (`data/leaders.json`, `data/resources.json`)
requiert un serveur HTTP (pas `file://`). En développement local, utilisez :
```bash
npx serve .
# ou
python3 -m http.server 8080
```

---

## Langue par défaut

La langue par défaut est `fr` (français). Changer dans `js/config.js` :

```js
defaultLang: "fr",   // "fr" | "es" | "en"
```

Le choix de l'utilisateur est sauvegardé dans `localStorage` pour ses visites suivantes.
