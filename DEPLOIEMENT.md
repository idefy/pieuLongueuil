
---

## Sous-pages

Les sous-pages sont accessibles via `page.html?p=slug`.

### Créer une sous-page

1. Dans le CMS → **📃 Sous-pages** → **New Sous-page**
2. Remplir le slug (ex: `conseil-jeunesse`), le titre dans les 3 langues, et les sections
3. Publier → la page est accessible à `https://pieulongueuil.ca/page.html?p=conseil-jeunesse`
4. Pour l'ajouter au menu : **🗂️ Menu — Ordre des pages** → ajouter une entrée avec le même slug → cocher **Visible dans le menu**

### Rôles et accès (DecapBridge)

| Rôle | Accès |
|---|---|
| `admin` | Tout le CMS |
| `editeur` | Toutes les sous-pages |
| `traducteur` | Toutes les sous-pages + Traductions |
| `page-mon-slug` | Uniquement la page dont le slug correspond |

**Pour attribuer un rôle :**
1. Aller dans **DecapBridge dashboard** → votre site → **Users**
2. Cliquer sur l'utilisateur → **Edit roles**
3. Ajouter le rôle souhaité (ex: `page-conseil-jeunesse`)

> Note : Decap CMS affiche toutes les collections à tous les utilisateurs connectés — les rôles contrôlent qui peut sauvegarder des modifications, pas qui voit quoi dans l'interface. Pour restreindre l'affichage, la solution avancée est d'utiliser plusieurs `config.yml` (un par rôle) pointant chacun vers un sous-ensemble de collections.

