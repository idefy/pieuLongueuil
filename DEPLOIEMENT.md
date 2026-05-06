# Guide de déploiement — Pieu Longueuil CMS

## Vue d'ensemble

Ce site utilise **Decap CMS** pour permettre aux administrateurs de modifier
le contenu sans toucher au code. L'interface d'administration est accessible
à `/admin` une fois le site déployé.

---

## ÉTAPE 1 — Mettre le site sur GitHub (5 minutes)

1. Créer un compte sur **github.com** si vous n'en avez pas
2. Cliquer **New repository** → nommer le repo `pieu-longueuil`
3. Choisir **Public** (requis pour l'hébergement gratuit)
4. Cliquer **Create repository**
5. Sur la page suivante, cliquer **uploading an existing file**
6. Glisser-déposer **tout le contenu** du dossier `pieu-longueuil-cms`
7. Cliquer **Commit changes**

---

## ÉTAPE 2 — Déployer sur Netlify (5 minutes)

1. Créer un compte sur **netlify.com** (gratuit)
2. Cliquer **Add new site → Import an existing project**
3. Choisir **GitHub** → autoriser Netlify à accéder à vos repos
4. Sélectionner le repo `pieu-longueuil`
5. Laisser les paramètres par défaut — cliquer **Deploy site**
6. Votre site sera en ligne en ~30 secondes à une URL comme `https://peaceful-[mot].netlify.app`

> **Domaine personnalisé** : dans Netlify → Domain settings → Add custom domain

---

## ÉTAPE 3 — Activer l'authentification (5 minutes)

1. Dans Netlify, aller dans **Project configuration → Identity**
2. Cliquer **Enable Identity**
3. Descendre à **Services → Git Gateway** → cliquer **Enable Git Gateway**
4. Dans **Registration** → choisir **Invite only** (important — empêche les inconnus de s'inscrire)

---

## ÉTAPE 4 — Inviter les administrateurs

1. Dans Netlify → **Identity → Invite users**
2. Entrer l'adresse courriel de chaque administrateur
3. Ils recevront un courriel d'invitation avec un lien pour créer leur mot de passe
4. **Ils n'ont pas besoin de compte GitHub** — Netlify Identity gère tout

---

## ÉTAPE 5 — Accéder à l'administration

Une fois invité, l'administrateur :

1. Va sur `https://votre-site.netlify.app/admin`
2. Clique **Login** → entre son courriel et mot de passe
3. L'interface CMS s'affiche

---

## Ce que chaque administrateur peut faire

### 👥 Dirigeants
- Modifier le nom, l'appel et la photo d'un dirigeant
- Ajouter un nouveau dirigeant
- Masquer un dirigeant sans le supprimer (case « Actif »)

### 📄 Ressources & Guides
- Ajouter un guide ou document pour les dirigeants
- Modifier le titre, la description ou le lien d'une ressource
- Changer le type (Guide, Vidéo, Information…)

### 🪟 Fenêtres modales
- Créer une nouvelle modale depuis zéro
- Modifier le contenu d'une modale existante
- Ajouter des sections : paragraphe, liste, image, lien, bouton, etc.
- **Pour lier une modale** dans le site : utiliser `href="modal:votre-id"`

### 🌿 Fiches service pastoral
- Modifier le contenu, les citations et les listes de chaque fiche
- Changer l'image d'une fiche
- Ajouter une nouvelle fiche

### 📋 Conférence de Pieu
- Mettre à jour la date et le programme de chaque session
- Ajouter ou supprimer des éléments (discours, cantiques, prières)

### ⚙️ Paramètres du site
- Changer les couleurs du thème
- Modifier le texte de la mission du pieu
- Mettre à jour les liens des réseaux sociaux
- Changer la photo de la chapelle

---

## Workflow de publication

```
Administrateur modifie → Clique "Publish" → GitHub enregistre → Netlify reconstruit → Site en ligne en ~30s
```

Toutes les modifications sont versionnées — on peut toujours revenir en arrière via GitHub.

---

## Structure des fichiers à connaître

```
pieu-longueuil-cms/
├── admin/
│   ├── index.html      ← Interface CMS (ne pas modifier)
│   └── config.yml      ← Schéma du CMS — modifier pour ajouter des champs
├── data/
│   ├── leaders.json    ← Dirigeants (géré par CMS)
│   ├── resources.json  ← Ressources (géré par CMS)
│   ├── settings.json   ← Paramètres du site (géré par CMS)
│   ├── conference.json ← Programme de conférence (géré par CMS)
│   ├── modals/         ← Fenêtres modales (géré par CMS)
│   │   └── rendez-vous.json
│   └── fiches/         ← Fiches service pastoral (géré par CMS)
├── assets/
│   ├── chapel.jpg
│   ├── leaders/        ← Photos des dirigeants
│   ├── modals/         ← Images des modales
│   ├── servicepastoral/← Images des fiches
│   └── uploads/        ← Photos uploadées via CMS
├── netlify.toml        ← Config Netlify (ne pas modifier)
└── index.html          ← Page principale
```

---

## Ajouter un nouveau champ au CMS

Si vous avez besoin d'un nouveau champ non prévu :

1. Ouvrir `admin/config.yml`
2. Trouver la collection concernée
3. Ajouter le champ selon la syntaxe YAML
4. Pousser sur GitHub → Netlify reconstruit automatiquement

Documentation : **decapcms.org/docs/widgets**

---

## Support

- Documentation Decap CMS : https://decapcms.org/docs/
- Support Netlify : https://docs.netlify.com/
- Demo CMS (sans login) : https://demo.decapcms.org/
