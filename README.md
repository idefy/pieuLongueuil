# Site Pieu Longueuil

Site web du Pieu de Longueuil (Québec) : ressources pour les membres, service pastoral, ressources pour les dirigeants, organisations et sous-pages. Il est disponible en français (langue par défaut), espagnol et anglais.

- **Site :** https://pieulongueuil.ca
- **Administration :** https://pieulongueuil.ca/admin (connexion avec un compte GitHub)
- **Dépôt :** `idefy/pieuLongueuil` (branche `main`)

Le site est **100 % statique** : HTML, JavaScript (ES6) et CSS, sans étape de build, sans framework et sans serveur applicatif. Le contenu est chargé au fil de la navigation depuis les fichiers `data/*.json`. L'hébergement et le déploiement sont décrits dans [`DEPLOIEMENT.md`](DEPLOIEMENT.md).

---

## Pour les éditeurs : modifier le contenu

Tout le contenu courant se modifie dans l'administration, **sans toucher au code** :

1. Aller sur https://pieulongueuil.ca/admin et se connecter avec GitHub. Le compte doit avoir été ajouté comme collaborateur du dépôt avec l'accès en écriture.
2. Choisir une collection dans le menu de gauche, modifier, puis **Publier**.
3. Le site se met à jour automatiquement environ une minute plus tard. Chaque enregistrement crée un commit dans GitHub dont le message se termine par « par le CMS ».

| Collection | Ce qu'on y modifie |
|---|---|
| 👥 Dirigeants | Noms, appels, photos et organisation de chaque dirigeant (`active: false` masque une personne sans la supprimer) |
| 👥 Ressources pour les membres | Les 6 boîtes de liens de la section « Ressources » |
| 📋 Pour les dirigeants — Ressources | Guides, vidéos et documents de la section « Pour les dirigeants » |
| 🪟 Fenêtres modales | Contenu des fenêtres qui s'ouvrent depuis les liens `modal:<id>` |
| 🌿 Fiches service pastoral | Les fiches thématiques du service pastoral |
| 📋 Conférence de Pieu | Programme de la page `conference.html` (accessible par code QR seulement) |
| ⚙️ Paramètres du site | Nom du pieu, mission, couleurs, réseaux sociaux, infolettre, citation pastorale |
| 🌐 Traductions (FR / ES / EN) | Textes de l'interface dans les trois langues |
| 📃 Sous-pages | Pages secondaires (`page.html?p=<slug>`), faites de blocs de contenu |
| 🗂️ Menu — Ordre des pages | Liste, ordre et visibilité des sous-pages dans le menu « Pages » |

### Images et fichiers

Les images et PDF téléversés vont dans le dossier `assets/`, qui est **plat** (aucun sous-dossier). Préfixer les noms selon l'usage (`leaders-…`, `modals-…`, `servicepastoral-…`). Les fichiers `.jfif` ne s'affichent pas dans l'aperçu : les renommer en `.jpg`.

### Créer une sous-page

1. Admin → **📃 Sous-pages** → nouvelle entrée : slug, titres FR/ES/EN et sections.
2. Pour l'afficher dans le menu : **🗂️ Menu — Ordre des pages** → ajouter le même slug et cocher « Visible dans le menu ».
3. Pour une adresse courte (`pieulongueuil.ca/<slug>`), un développeur doit ajouter une ligne dans `_redirects` (voir ci-dessous). Sans cela, la page reste accessible par `page?p=<slug>`.

### Blocs « Colonnes » et « Vidéo » (sous-pages)

Dans une sous-page, **Sections → Ajouter** propose deux blocs en plus des blocs de texte :

**▥ Colonnes (2 à 5).** Affiche de 2 à 5 colonnes côte à côte.
- Ajouter les colonnes (minimum 2, maximum 5), puis, dans chacune, les éléments voulus : 📌 Titre, ¶ Texte, 🖼️ Image, ▶ Vidéo, 🔘 Bouton, 🔗 Lien simple. Chaque colonne contient ce qu'on veut, dans l'ordre voulu : glisser les éléments pour les réordonner.
- Tous les éléments ont des champs FR/ES/EN ; une traduction manquante retombe sur le français. Les images, les boutons et les liens peuvent aussi avoir une version propre à chaque langue.
- Le texte accepte `**gras**`, `*italique*` et `[texte](url)` ; une ligne vide crée un nouveau paragraphe. Les URL des boutons et des liens acceptent `modal:<id>` pour ouvrir une fenêtre.
- Une colonne sans contenu est ignorée (les autres se partagent la largeur).
- Affichage : sur mobile, les colonnes s'empilent dans l'ordre saisi ; sur tablette, 2 colonnes ; sur grand écran, 3 à 5 colonnes (les blocs de 3 à 5 colonnes dépassent un peu la largeur du texte).

**▶ Vidéo (YouTube / Vimeo).** Coller simplement l'URL de la vidéo.
- Formats reconnus : `youtube.com/watch?v=…`, `youtu.be/…`, `/shorts/`, `/live/`, `/embed/` et `vimeo.com/<numéro>` (y compris les liens non répertoriés). Un point de départ (`?t=1m30s` ou `?start=90`) est respecté.
- Champs optionnels : une URL propre à chaque langue (par exemple une vidéo différente en espagnol) et une légende FR/ES/EN, affichée sous la vidéo et lue par les lecteurs d'écran.
- Le lecteur s'adapte à la largeur (format 16:9). YouTube est chargé via `youtube-nocookie.com` et Vimeo avec « ne pas suivre », donc sans témoin de suivi avant la lecture.
- Un lien d'un autre site n'est pas intégré : il s'affiche comme un simple lien.

### Ajouter une fiche de service pastoral

Les fiches affichées sont celles listées dans `data/fiches-index.json`. Après avoir créé une fiche dans l'admin, un développeur doit ajouter son identifiant (`fiche_id`) à ce fichier, sinon elle n'apparaît pas sur le site.

---

## Pour les développeurs

### Structure

```
├── index.html            Page principale (sections ressources / pastoral / dirigeants / organisations)
├── page.html             Gabarit des sous-pages (page?p=<slug>)
├── conference.html       Programme de conférence (code QR, absent du menu)
├── _redirects            Règles de routage Cloudflare Pages (adresses courtes, PDF)
├── admin/
│   ├── index.html        Chargeur Decap CMS + aperçu personnalisé des sous-pages
│   └── config.yml        Schéma du CMS (toutes les collections)
├── functions/api/        Connexion GitHub OAuth pour le CMS (auth.js, callback.js)
├── css/main.css          Styles globaux, pilotés par des variables CSS
├── js/
│   ├── config.js         Valeurs par défaut (couleurs, liens officiels, langue par défaut)
│   ├── i18n.js           Chargeur de traductions et fonction t(clé)
│   ├── app.js            Logique de index.html
│   ├── page.js           Moteur des sous-pages
│   ├── modals.js         Fenêtres modales
│   └── calendar.js       Bloc calendrier de l'Église
├── data/                 Tout le contenu (JSON)
│   ├── leaders.json, resources.json, member-resources.json, settings.json
│   ├── fiches-index.json + fiches/<id>.json   (fiches pastorales)
│   ├── pages/<slug>.json + pages-index.json   (sous-pages et menu)
│   ├── modals/<id>.json, conference.json
│   ├── i18n/*.json       Traductions de l'interface (7 fichiers)
│   └── fiches.js         Ancienne source des fiches, conservée comme solution de repli
├── assets/               Médias (dossier plat)
└── digitalboard/         Prototype de tableau d'affichage — à ne pas mélanger avec le site
```

### Développement local

Le chargement des fichiers JSON exige un serveur HTTP (pas `file://`) :

```bash
npx serve .
# ou
python3 -m http.server 8080
```

Les fonctions `functions/api/` (connexion à l'admin) ne s'exécutent que sur Cloudflare Pages. Le calendrier dépend d'un Worker Cloudflare externe et ne se charge normalement que depuis `pieulongueuil.ca`.

### Règles à respecter

- **Règle du miroir :** toute modification de la forme d'un fichier de données doit être reproduite exactement dans `admin/config.yml`, sinon le CMS casse ou ignore silencieusement des champs. Après chaque modification, valider le YAML (par exemple avec PyYAML).
- **Listes dans le CMS :** une collection de type « fichier » avec un champ `list` exige que le JSON soit **enveloppé dans un objet** (`{ "leaders": [ … ] }`), pas un tableau nu.
- **Nouvelle chaîne d'interface :** l'ajouter dans les trois langues dans le bon fichier de `data/i18n/`, **et** ajouter le champ correspondant dans l'entrée `translations` de `config.yml`.
- **Nouveau type de bloc :** (1) `types` dans `config.yml` pour les pages et la conférence, (2) un `case` dans `renderSection` de `js/page.js`, (3) le même dans `renderBlock` de `conference.html`, (4) l'aperçu dans `admin/index.html` si souhaité, (5) les chaînes i18n au besoin. Les listes de types sont dupliquées volontairement (pas d'ancres YAML) et doivent rester synchronisées à la main.
- **Blocs réservés aux sous-pages :** `leaders`, `columns` et `video` n'existent que dans les sous-pages (pas dans la conférence) ; les étapes (1) et (3) ci-dessus se limitent alors à la collection `pages`. Les éléments d'une colonne sont rendus par `spColItem` dans `js/page.js` : un nouveau type d'élément s'ajoute à cet endroit **et** dans la liste `types` du bloc `columns` de `config.yml` (avec son aperçu dans `admin/index.html`). Les vidéos passent par `spVideoSrc` / `spVideoHTML` : seuls YouTube et Vimeo sont intégrés (les autres liens deviennent un lien simple) ; le bloc `video` et l'élément de colonne `video` partagent le même code. Le CSS de ces blocs (`.sp-columns`, `.sp-video`) est dans `page.html`.
- **Couleurs :** utiliser les variables CSS (`--c-primary`, `--c-secondary`, etc.), jamais de couleur codée en dur. Les valeurs de `data/settings.json` remplacent celles de `js/config.js`.
- **Polices :** Playfair Display (titres) et Lato (texte), chargées par un lien Google Fonts dans `app.js`, `page.html` et `conference.html`. Le bloc `fonts` de `js/config.js` est obsolète et n'est plus utilisé par `page.js`.
- **`js/calendar.js` doit rester après `js/page.js`** dans `page.html` : il enveloppe la fonction globale `renderSection`.
- **`digitalboard/`** est un prototype séparé : ne jamais mélanger son code, ses styles ou ses imports avec le site.

### Adresses courtes (`_redirects`)

Une ligne par sous-page :

```
/<slug>    /page?p=<slug>    200
```

`_redirects` n'est pas géré par le CMS : l'ajouter à la main, puis déployer. Les raccourcis vers des PDF sont de la forme `/remboursement /assets/Remboursement.pdf 302` (les noms de fichiers respectent la casse).

### Langues

`fr` (par défaut), `es` et `en`. La langue choisie est mémorisée dans `localStorage` (clé `pieu-lang`). La langue par défaut se change dans `js/config.js` (`defaultLang`). Le contenu est traduit dans ses propres fichiers (`*_fr`, `*_es`, `*_en` ou `{ fr, es, en }`) ; une traduction manquante retombe sur le français.
