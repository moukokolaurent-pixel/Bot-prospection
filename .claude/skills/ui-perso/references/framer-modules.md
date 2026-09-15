# Modules Framer — ce qu'ils sont, et ce qu'ils ne sont pas

Une URL de la forme :

```
https://framer.com/m/<Nom>-<id>.js@<hash>
```

n'est **pas** un item de registre shadcn. Aucune commande `npx shadcn add` ne l'installe.
C'est un module ESM hébergé par Framer.

## Anatomie de l'URL

| Partie | Rôle |
|---|---|
| `framer.com/m/` | CDN de modules Framer |
| `<Nom>-<id>.js` | le module ; l'`id` identifie la publication, pas la version |
| `@<hash>` | **épingle une version immuable** — sans lui, l'URL suit la dernière version publiée |

Garder le `@<hash>`. Une URL sans hash peut changer de comportement sous vos pieds au prochain
déploiement de son auteur.

## Usage prévu : dans Framer

`Insert` → `Code component from URL` → coller l'URL. C'est le seul chemin où ces modules sont
un choix normal : le runtime est déjà là, les property controls s'affichent dans le panneau,
et la mise à jour est gérée par Framer.

## Usage hors Framer (Next.js, Vite, Astro) : possible, rarement raisonnable

Techniquement c'est un import ESM distant. Les quatre problèmes, par ordre de gravité :

1. **Disponibilité.** Votre build dépend d'une URL que vous ne contrôlez pas. Si l'auteur
   dépublie le module, la page casse en production. Aucun `package-lock.json` ne vous protège.
2. **CSP.** Un import distant à l'exécution exige `script-src` élargi vers le domaine Framer.
   Sur un site avec une CSP stricte, c'est un renoncement à la politique, pas un réglage.
3. **SSR / prerender.** Le module suppose un DOM. En rendu serveur Next.js il faut le charger
   en `dynamic(..., { ssr: false })`, donc pas de contenu au premier paint — mauvais pour un hero.
4. **Poids.** Il tire le runtime Framer et `framer-motion` en entier, sans tree-shaking, en
   doublon de ce que le projet embarque peut-être déjà.

**Alternative à privilégier** : chercher l'effet équivalent dans un registre shadcn du catalogue
(`search.py --domain source`), où le code atterrit dans le dépôt, versionné et modifiable.
Un scroll-zoom-reveal se réimplémente en ~40 lignes avec `framer-motion` + `useScroll`.

## Avant de cataloguer un module Framer

- Ouvrir l'URL dans un navigateur et lire l'en-tête du fichier : `addPropertyControls`,
  `ControlType.*` et les `import ... from "framer"` confirment que c'est bien un composant Framer.
- Chercher la licence sur la page marketplace de l'auteur. **Il n'y a pas de licence globale
  Framer** : c'est module par module, et beaucoup n'en déclarent aucune.
- Renseigner `license` avec ce qui est réellement écrit, ou `a verifier`. Ne jamais supposer MIT.
- Laisser `last_verified` **vide** tant que le contenu n'a pas été lu. `search.py` affiche alors
  `Verifie le : JAMAIS`, ce qui est le comportement voulu.

## Note sur cet environnement

`framer.com` et `framerusercontent.com` sont refusés par la politique réseau des sessions
Claude Code distantes (403 au CONNECT du proxy). Les modules Framer ne peuvent donc pas être
vérifiés depuis une session distante — seulement depuis votre machine.
