# ui-perso

Catalogue personnel de ressources UI, utilisable comme **skill Claude Code** dans tous vos projets.

Compagnon de [`ui-ux-pro-max`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), délibérément
tenu **à l'extérieur** de celui-ci : `ui-ux-pro-max` résout ses données via un `DATA_DIR` codé en dur
sans hook d'extension, et `/plugin install` comme `uipro init` remplacent son répertoire entier à
chaque mise à jour. Toute ressource personnelle placée dedans serait ignorée par sa recherche, puis
effacée au premier update.

Division du travail :

| | rôle |
|---|---|
| `ui-ux-pro-max` | le **quoi** — style, palette, typo, règles UX pour un type de produit |
| `ui-perso` | le **avec quoi** — les composants, registres et snippets que *vous* avez retenus |

## Installation

```bash
git clone <url-de-ce-depot> ~/dev/ui-perso
cd ~/dev/ui-perso
./install.sh
```

`install.sh` crée un lien symbolique `~/.claude/skills/ui-perso` vers ce dossier — un lien, pas une
copie : vous éditez les CSV ici, vous commitez ici, et c'est à jour dans tous vos projets
immédiatement.

```bash
./install.sh --status   # où on en est
./install.sh --remove   # retirer le lien
```

Le skill est chargé au démarrage suivant de Claude Code.

## Utilisation

```bash
python3 scripts/search.py "particules hero"
python3 scripts/search.py --domain component --stack nextjs
python3 scripts/search.py --domain source --tag webgl
python3 scripts/search.py --list --json
```

Deux niveaux : `sources.csv` pour les registres entiers, `components.csv` pour les items précis
déjà examinés.

## Types de ressources

La colonne `kind` décide de la marche à suivre — elles ne s'installent pas de la même façon.

| `kind` | Installation |
|---|---|
| `shadcn-registry-item` | `npx shadcn@latest add <url>` — le code atterrit dans votre dépôt |
| `framer-module` | Aucune commande shell. Dans Framer : `Insert > Code component from URL`. Dans du code : preflight obligatoire, puis wrapper |

Pour un module Framer destiné à un projet en code :

```bash
python3 scripts/framer-preflight.py "https://framer.com/m/<...>.js@<hash>"
```

Le script dit si le module est chargeable hors de Framer et pourquoi. Voir
`references/framer-modules.md`.

## Ajouter une ressource

`references/ajouter-une-ressource.md`. Trois règles qui font la valeur du catalogue :

- Le champ `notes` dit **ce qui coince**, pas ce qui brille.
- `install` vide n'est pas un oubli : ça signale une ressource sans commande.
- `last_verified` vide n'est pas un oubli non plus : ça signale une ressource jamais vérifiée,
  et la recherche l'affiche en toutes lettres.

## Portée

Ce dépôt n'appartient à aucun projet. Rien de spécifique à un client ne doit y entrer — ça va dans
le dépôt du projet concerné.

## Licence

Le catalogue (schémas, scripts, documentation) est à vous. Les ressources référencées gardent
chacune la licence de leur auteur, indiquée dans la colonne `license` — vérifiée quand ça a été
possible, `a verifier` sinon.
