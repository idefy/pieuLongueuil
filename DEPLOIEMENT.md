# Déploiement et exploitation — Pieu Longueuil

Ce document décrit comment le site est hébergé, comment fonctionne la connexion à l'administration et comment dépanner. Pour la structure du code et l'édition du contenu, voir [`README.md`](README.md).

## Vue d'ensemble

| Élément | Valeur |
|---|---|
| Hébergement | Cloudflare Pages, projet `pieulongueuil` |
| Domaine | `pieulongueuil.ca` |
| Dépôt | `github.com/idefy/pieuLongueuil`, branche `main` |
| Commande de build | aucune |
| Dossier de sortie | `/` (la racine du dépôt) |
| CMS | Decap CMS 3.8.4, chargé depuis unpkg dans `admin/index.html` |
| Connexion à l'admin | GitHub OAuth via Cloudflare Pages Functions (`functions/api/auth.js` et `callback.js`) |

**Flux de publication :** une modification faite dans `/admin` (ou un envoi direct de fichiers sur GitHub) crée un commit sur `main`. Cloudflare Pages détecte le commit et redéploie le site automatiquement, en environ une minute.

L'ancien hébergement Netlify, Netlify Identity, Git Gateway et DecapBridge ne sont plus utilisés.

---

## Mettre en ligne une modification (développeurs)

Les modifications de code se publient sur GitHub, branche `main` :

1. Remplacer ou ajouter les fichiers modifiés, avec leurs chemins relatifs à la racine du dépôt (par exemple `js/app.js`, `admin/config.yml`).
2. Faire un commit sur `main`. Cloudflare Pages redéploie automatiquement.
3. Attendre environ une minute, puis rafraîchir la page sans cache (Ctrl+Maj+R).

Pour revenir en arrière : dans GitHub, annuler (revert) le commit fautif ; ou, dans Cloudflare Pages, rétablir un déploiement précédent depuis l'onglet des déploiements.

Avant de publier une modification de `admin/config.yml`, vérifier qu'il s'analyse correctement (par exemple avec PyYAML). Une erreur de syntaxe casse toute l'administration.

---

## Connexion à l'administration (GitHub OAuth)

Le CMS enregistre ses modifications comme des commits GitHub. La connexion se fait donc avec un compte GitHub, au moyen d'une application OAuth et de deux fonctions Cloudflare.

### Configuration actuelle

- `admin/config.yml` : backend `github`, dépôt `idefy/pieuLongueuil`, branche `main`, `base_url: https://pieulongueuil.ca`, `auth_endpoint: /api/auth`.
- `functions/api/auth.js` redirige vers GitHub avec la portée `repo,user`. L'adresse de retour est **codée en dur** : `https://pieulongueuil.ca/api/callback`.
- `functions/api/callback.js` échange le code contre un jeton et le renvoie au CMS.
- Deux variables d'environnement sont définies dans Cloudflare Pages : `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET`. Ne jamais les écrire dans le dépôt.

### Recréer l'application OAuth (si nécessaire)

1. Sur GitHub : paramètres du compte ou de l'organisation → Developer settings → OAuth Apps → New OAuth App.
2. **Homepage URL :** `https://pieulongueuil.ca`
3. **Authorization callback URL :** `https://pieulongueuil.ca/api/callback`
4. Créer l'application, puis générer un Client secret.
5. Dans Cloudflare Pages, projet `pieulongueuil` → Settings → variables d'environnement (et secrets) : définir `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` pour l'environnement de production.
6. Redéployer pour que les variables soient prises en compte.

Les libellés des menus de GitHub et de Cloudflare peuvent changer ; la logique reste la même.

### Ajouter ou retirer un éditeur

- **Ajouter :** inviter la personne comme collaborateur du dépôt GitHub avec l'accès **Write** (Settings → Collaborators). Elle se connecte ensuite à `/admin` avec son compte GitHub.
- **Retirer :** retirer la personne des collaborateurs du dépôt.

Il n'y a pas de limite d'utilisateurs, contrairement à Netlify Identity.

### Qui apparaît comme auteur d'un commit ?

Les commits faits par le CMS sont enregistrés par GitHub au nom du compte connecté, donc l'auteur réel reste visible dans l'historique GitHub. Le message du commit se termine par « par le CMS » (par exemple `Modifier dirigeants "leaders" par le CMS`) pour indiquer que la modification vient de l'administration. Ce texte est défini dans `commit_messages` de `admin/config.yml`.

### Rôles

Decap CMS ne peut pas masquer des collections selon l'utilisateur : toute personne ayant accès en écriture voit tout le contenu de l'administration. Une séparation par rôle (un `config.yml` distinct par rôle, sur un autre chemin du type `/admin-…/`) est envisagée mais **n'est pas commencée**. L'ancienne section sur les rôles DecapBridge ne s'applique plus.

---

## Routage (`_redirects`)

Le fichier `_redirects` à la racine gère les adresses courtes. Il n'est pas géré par le CMS. Une ligne par sous-page :

```
/<slug>    /page?p=<slug>    200
```

Créer une sous-page demande donc : la créer dans l'admin, la lister dans le menu si voulu, ajouter la ligne dans `_redirects` à la main, puis déployer. Les raccourcis vers des PDF ont la forme `/remboursement /assets/Remboursement.pdf 302` (les noms de fichiers respectent la casse).

---

## Calendrier de l'Église

Le bloc calendrier ne peut pas lire directement le flux iCal de l'Église depuis le navigateur. `js/calendar.js` passe par un Worker Cloudflare : `https://white-sun-144.idefaye.workers.dev/?url=<adresse du flux>`. Ce Worker est partagé avec le prototype `digitalboard/` et son code **n'est pas dans ce dépôt**.

Si un calendrier affiche « Calendrier non disponible », vérifier en premier que le Worker accepte les requêtes venant de `pieulongueuil.ca`.

---

## Dépannage

| Symptôme | Piste |
|---|---|
| Le site ne se met pas à jour après un commit | Vérifier le dernier déploiement dans Cloudflare Pages ; rafraîchir sans cache |
| `/admin` est vide ou affiche une erreur au chargement | Erreur de syntaxe dans `admin/config.yml` : annuler le dernier commit sur ce fichier |
| Connexion refusée ou fenêtre de connexion qui se ferme | Vérifier l'adresse de retour de l'application OAuth, les variables `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`, et que la personne est collaboratrice avec accès Write |
| Une modification faite dans l'admin n'apparaît pas | Vérifier que le commit existe sur `main` dans GitHub, attendre la fin du déploiement, puis rafraîchir sans cache |
| Une nouvelle fiche pastorale n'apparaît pas | Ajouter son identifiant à `data/fiches-index.json` |
| Une adresse courte affiche « Page introuvable » | Vérifier la ligne correspondante dans `_redirects` |
| Les fichiers JSON ne se chargent pas en local | Utiliser un serveur HTTP (`npx serve .`), pas `file://` |
