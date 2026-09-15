---
name: ui-perso
description: "Catalogue personnel de ressources UI a utiliser AVEC ui-ux-pro-max. Registres shadcn perso, composants vettes, snippets et references visuelles gardes hors du skill ui-ux-pro-max pour survivre a ses mises a jour. Personal curated UI resource catalog: shadcn registry sources, vetted components, reusable snippets. Use when building or styling an interface, adding a component, looking for an animation / hero effect / particle background / 3D effect, when the user mentions npx shadcn add, a registry URL, VengeanceUI, or asks for 'mes composants', 'mes ressources', 'ma banque de composants', 'ce que j'ai deja'. Also use before writing a custom component from scratch, to check whether a vetted one already exists."
---

# Ressources UI perso

Catalogue **personnel** et **versionne** de ressources UI. Vit a cote de `ui-ux-pro-max`, jamais dedans.

## Pourquoi ce skill existe separement

`ui-ux-pro-max` resout le **quoi** : quel style, quelle palette, quelle typo, quelles regles UX pour ce type de produit. Sa base de donnees est generique et livree par son auteur.

Ce skill resout le **avec quoi** : les composants concrets, registres et snippets que *vous* avez retenus.

Les deux doivent rester separes pour une raison mecanique : `ui-ux-pro-max/scripts/core.py` resout ses donnees via `DATA_DIR = Path(__file__).parent.parent / "data"`, en dur, sans hook d'extension. Et `/plugin install` comme `uipro init` **remplacent tout le repertoire du skill** a chaque mise a jour. Toute ressource perso placee dedans serait ignoree par sa recherche, puis effacee au premier update.

## Quand l'utiliser

- Avant d'ecrire un composant a la main : verifier qu'une version vettee existe deja.
- Quand un effet precis est demande (particules, fond anime, hero WebGL, curseur custom, transition).
- Quand l'utilisateur mentionne `npx shadcn add`, une URL de registre, ou un nom de librairie du catalogue.
- Quand l'utilisateur parle de « mes composants », « mes ressources », « ce que j'ai deja ».
- Apres avoir ajoute une ressource, pour la consigner (voir `references/ajouter-une-ressource.md`).

## Ordre d'appel — important

```
1. ui-ux-pro-max   ->  design system (style, palette, typo, tokens, regles UX)
2. ui-perso        ->  composants concrets qui remplissent ce design system
3. adaptation      ->  re-skinner le composant sur les tokens de l'etape 1
```

**Ne jamais inverser 1 et 2.** Choisir d'abord un composant, puis construire la palette autour, produit une page qui ressemble a la demo du registre, pas au produit. Les composants de registre arrivent avec leurs propres couleurs en dur (`bg-white/5`, `text-white/60`, `#000000` en prop par defaut) : l'etape 3 n'est pas optionnelle, c'est la ou le composant cesse d'etre un corps etranger.

## Rechercher dans le catalogue

```bash
python3 .claude/skills/ui-perso/scripts/search.py "particules hero"
python3 .claude/skills/ui-perso/scripts/search.py --domain component --stack nextjs
python3 .claude/skills/ui-perso/scripts/search.py --domain source --tag webgl
python3 .claude/skills/ui-perso/scripts/search.py --list          # tout le catalogue
python3 .claude/skills/ui-perso/scripts/search.py "hero" --json   # sortie machine
```

Deux domaines :

| Domaine | Fichier | Contenu |
|---|---|---|
| `source` | `registry/sources.csv` | Registres et librairies entieres, avec leur motif d'installation et leur URL d'index |
| `component` | `registry/components.csv` | Items precis deja vettes, avec leur commande exacte et leurs pieges |

Si la recherche ne renvoie rien, **ne pas inventer de commande d'installation**. Soit lire l'`index_url` du registre concerne pour trouver le nom exact de l'item, soit dire que la ressource n'est pas au catalogue.

## Toutes les ressources ne s'installent pas pareil

La colonne `kind` de `components.csv` decide de la marche a suivre. **Ne jamais appliquer la procedure d'un `kind` a un autre.**

| `kind` | Installation | Reference |
|---|---|---|
| `shadcn-registry-item` | `npx shadcn@latest add <url>` — le code atterrit dans le depot | ci-dessous |
| `framer-module` | **Aucune commande shell.** Module ESM distant, insere dans Framer | `references/framer-modules.md` |

Une ligne dont `install` est vide n'a pas de commande : `search.py` affiche alors `Installation : aucune commande — voir Notes`. Ne pas fabriquer un `npx` autour de son `url`.

Une ligne dont `last_verified` est vide s'affiche `Verifie le : JAMAIS`. Le contenu n'a pas ete lu : le signaler avant de proposer la ressource, ne pas la presenter comme validee.

## Installer un item de registre shadcn

1. **Lire le JSON avant de l'installer.** `npx shadcn add <url>` ecrit du code arbitraire dans le projet et ajoute des dependances npm. `curl -sS <url> | head -60` suffit a voir le `type`, les `dependencies`, et le `target` du fichier.
2. Verifier que les `dependencies` sont acceptables. `three` + `gsap` pour un seul hero, c'est ~150 ko gzip ajoutes au bundle.
3. Verifier que le `target` n'ecrase pas un fichier existant (`components/ui/button.tsx` notamment — plusieurs registres redefinissent les primitives shadcn).
4. Installer, puis passer a l'adaptation aux tokens.

## Adapter aux tokens du design system

Apres installation, systematiquement :

- Remplacer les couleurs en dur par les tokens semantiques decides a l'etape 1.
- Verifier le contraste du texte pose sur l'effet (4.5:1 minimum — c'est la regle de priorite 1 de `ui-ux-pro-max`).
- Ajouter un fallback `prefers-reduced-motion` si le composant n'en a pas. La plupart des composants de registre n'en ont pas.
- Verifier le comportement mobile : un effet WebGL plein ecran sur un telephone milieu de gamme se traduit par une batterie qui chauffe.

## Ajouter une ressource au catalogue

Voir `references/ajouter-une-ressource.md`. Regle courte : une ligne CSV, tags en francais **et** en anglais, `notes` qui dit le piege et pas la promesse marketing, `last_verified` a la date du jour.

## Structure

```
ui-perso/
├── SKILL.md                      ce fichier
├── registry/
│   ├── sources.csv               registres et librairies entieres
│   └── components.csv            items precis, vettes
├── scripts/search.py             moteur de recherche
├── references/
│   ├── ajouter-une-ressource.md  conventions de saisie et re-verification
│   └── framer-modules.md         modules Framer : pourquoi ce n'est pas un item shadcn
└── snippets/                     bouts de code reutilisables
```
