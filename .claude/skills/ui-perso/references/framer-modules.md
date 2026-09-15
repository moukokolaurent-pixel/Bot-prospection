# Faire fonctionner un module Framer

Une URL de la forme `https://framer.com/m/<Nom>-<id>.js@<hash>` est un **module ESM hébergé
par Framer**. Aucune commande `npx shadcn add` ne l'installe.

| Partie | Rôle |
|---|---|
| `framer.com/m/` | CDN de modules Framer |
| `<Nom>-<id>.js` | le module ; l'`id` identifie la publication |
| `@<hash>` | **épingle une version immuable** — sans lui, l'URL suit la dernière version publiée |

Garder le `@<hash>`. Sans lui, le comportement peut changer sous vos pieds quand l'auteur republie.

---

## Chemin 1 — dans Framer (le cas normal)

`Insert` → `Code component from URL` → coller l'URL.

C'est le seul contexte où ces modules sont un choix évident : le runtime est déjà là, les
**property controls** apparaissent dans le panneau de droite, et les mises à jour sont gérées
par Framer. Rien d'autre à faire.

Si votre site final est un site Framer, arrêtez-vous ici. Tout ce qui suit ne vous concerne pas.

---

## Chemin 2 — dans du code (Next.js, Vite, Astro)

Possible, mais **à vérifier avant d'essayer**. Deux choses peuvent rendre l'opération
impossible, et aucune n'est visible à l'œil nu.

### Étape 1 — le preflight, obligatoire

```bash
python3 .claude/skills/ui-perso/scripts/framer-preflight.py "https://framer.com/m/<...>.js@<hash>"
```

À lancer **depuis votre machine** : les sessions Claude Code distantes ont framer.com refusé
par leur politique réseau et obtiennent toujours `INJOIGNABLE`.

Le script télécharge le module et répond sur quatre points :

| Contrôle | Pourquoi c'est bloquant |
|---|---|
| **Imports nus** (`"react"`, `"framer"`) | Un navigateur ne sait pas les résoudre sans import map. Le module ne charge pas, point. |
| **Plusieurs sources de React** | Deux instances de React ⇒ `Invalid hook call`, écran vide. |
| Property controls | Non bloquant, mais inertes hors Framer : il faut lire leur définition pour connaître les props et leurs valeurs par défaut. |
| Taille / type | Informatif. |

Verdict `NE FONCTIONNERA PAS TEL QUEL` ⇒ **ne pas insister**. Le problème est dans le module,
aucun wrapper ne le corrige. Réimplémentez l'effet.

Verdict `CHARGEABLE` ⇒ étape 2.

### Étape 2 — le montage

`snippets/framer-module-in-next.tsx` fournit le composant `FramerModule`. Il gère ce qui casse
en pratique :

- `webpackIgnore` pour que le bundler laisse l'URL tranquille (sinon échec au build) ;
- rendu client uniquement, jamais en SSR ;
- un espace réservé pendant le chargement, pour éviter le saut de page (CLS) ;
- `prefers-reduced-motion` : le module n'est même pas téléchargé ;
- un état d'échec explicite au lieu d'une page blanche.

### Étape 3 — ce qui reste à votre charge

**CSP.** Un import distant exige `script-src` élargi vers les domaines listés par le preflight.
Sur un site à CSP stricte, c'est un renoncement à la politique, pas un réglage.

**Le fallback n'est pas une consolation.** C'est ce que verront : les visiteurs en mouvement
réduit, ceux sous CSP stricte, et *tout le monde* le jour où Framer retire l'URL. Il doit tenir
debout seul. Un `<div>` vide ne remplit pas ce contrat.

**Vous ne possédez pas ce code.** Aucun `package-lock.json` ne vous protège d'une dépublication.
C'est la différence de fond avec un item de registre shadcn, dont le code atterrit dans votre
dépôt et y reste.

---

## Alternative, souvent plus courte qu'on ne croit

Avant d'engager les trois étapes, chercher l'effet dans les registres du catalogue :

```bash
python3 .claude/skills/ui-perso/scripts/search.py --domain source
```

Un scroll-zoom-reveal se réimplémente en une quarantaine de lignes avec `framer-motion` et
`useScroll`. Le code est dans votre dépôt, versionné, modifiable, et ne dépend de personne.

---

## Avant de cataloguer un nouveau module Framer

- Lancer le preflight et **coller son verdict dans le champ `notes`**.
- Chercher la licence sur la page marketplace de l'auteur. **Il n'y a pas de licence globale
  Framer** : c'est module par module, et beaucoup n'en déclarent aucune. Ne jamais supposer MIT.
- Renseigner `last_verified` **uniquement** après avoir lu le contenu. Tant qu'il est vide,
  `search.py` affiche `Verifie le : JAMAIS`, ce qui est le comportement voulu.
