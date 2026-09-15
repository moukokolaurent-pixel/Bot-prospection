# Faire utiliser une ressource du catalogue

## Le malentendu a lever

« Claude Design » n'est pas un interlocuteur separe. C'est le meme agent, avec un skill charge qui
lui fait produire des artboards `.dc.html` au lieu de fichiers de projet. On ne lui adresse rien
directement : on ecrit a l'agent, et la vraie question est **est-ce que le catalogue sera consulte**.

Trois leviers, du plus ponctuel au plus durable.

---

## Levier 1 — nommer l'`id` exact (ponctuel, tres fiable)

Chaque ligne du catalogue a un identifiant stable. Le citer ne laisse aucune place a
l'interpretation :

```
Fais-moi un canvas landing page pour un electricien.
Pour le hero, base-toi sur vengeance-interactive-particles.
```

L'agent retrouve la ligne avec `search.py`, lit ses `notes`, et sait quoi faire de la cible
(installer, reimplementer, ou refuser si c'est impossible).

Pour lister les identifiants disponibles :

```bash
python3 ~/.claude/skills/ui-perso/scripts/search.py --list | grep '^###'
```

## Levier 2 — `/ui-perso` (ponctuel, force le chargement)

Taper la commande force le chargement du skill, sans dependre du declenchement automatique :

```
/ui-perso un fond anime pour un hero sombre
```

Utile quand la demande est formulee de facon qui ne declencherait pas le skill toute seule.

## Levier 3 — une regle CLAUDE.md (permanent, le seul vraiment fiable)

Le declenchement d'un skill depend de la formulation. Une regle dans `CLAUDE.md` est lue a chaque
session, sans condition. C'est le seul levier qui tienne « pour toujours ».

Dans `~/.claude/CLAUDE.md` (global, tous projets) :

```markdown
## Ressources UI

Avant toute tache de design ou d'interface — page, composant, canvas Claude Design,
artboard, Artifact — consulter le catalogue perso :

    python3 ~/.claude/skills/ui-perso/scripts/search.py "<ce que je cherche>"

Verifier qu'une ressource vettee existe avant d'en ecrire une depuis zero.
Respecter la matrice cible x kind du SKILL.md : un framer-module ne fonctionne pas
dans un artboard, un item shadcn n'y est pas installable mais son effet se
reimplemente via cdnjs.
```

`install.sh --claude-md` ajoute ce bloc pour vous.

---

## Formules qui marchent

| Intention | Formulation |
|---|---|
| Ressource precise | « base-toi sur `<id>` pour le hero » |
| Par effet, sans connaitre l'id | « cherche dans mon catalogue un effet de particules au curseur » |
| Exclure une ressource | « pas de WebGL sur cette page, c'est pour du mobile » |
| Verifier avant de construire | « qu'est-ce que j'ai deja pour une section features ? » |

## Formules qui ne marchent pas

**« Utilise mes composants habituels »** — rien dans le catalogue ne dit ce qui est habituel.
Nommer, ou decrire l'effet.

**Coller une URL de registre sans contexte** — l'agent ne sait pas si vous voulez l'installer,
la cataloguer, ou juste savoir ce que c'est. Le dire.

**« Fais comme sur le site X »** — hors catalogue, et hors de ce que l'agent peut verifier.
Decrire l'effet voulu, puis chercher dedans.

---

## Cas particulier : un canvas Claude Design

Preciser la cible change la reponse. Sans elle, l'agent suppose un projet de code et peut proposer
une ressource inutilisable dans un artboard.

```
Canvas Claude Design, 3 artboards pour une landing electricien.
Hero inspire de vengeance-interactive-particles — je sais que le composant
n'est pas installable dans un artboard, reimplemente l'effet via cdnjs.
```

La seconde phrase n'est pas indispensable si la regle CLAUDE.md du levier 3 est en place : la
matrice cible x kind du SKILL.md dit deja quoi faire. Elle sert surtout a lever le doute quand
on hesite.
