# Utiliser ce catalogue avec Claude Design

Claude Design produit des artboards `.dc.html` publiés comme **Artifact**. C'est une cible
radicalement differente d'un depot de code, et la plupart des ressources du catalogue **ne s'y
installent pas**.

## La contrainte, d'abord

La CSP du visualiseur d'Artifacts n'autorise les scripts externes que depuis quatre hotes :

```
cdnjs.cloudflare.com        (a privilegier)
cdn.jsdelivr.net/npm/
cdn.tailwindcss.com
code.jquery.com
```

Feuilles de style externes : `fonts.googleapis.com` uniquement, polices depuis `fonts.gstatic.com`.

**Tout le reste est bloque, sans erreur visible** : tous les autres hotes (unpkg et esm.sh
compris), et toute requete `fetch` / XHR / WebSocket vers un hote externe.

Consequence directe : ni `framer.com`, ni `framerusercontent.com`, ni
`raw.githubusercontent.com` ne sont joignables depuis un artboard.

## Ce que ca donne, par `kind`

| `kind` | Dans un artboard Claude Design |
|---|---|
| `framer-module` | **Impossible.** L'hote est hors CSP, le script ne chargera pas, et l'echec est silencieux. Ne pas essayer, ne pas le proposer. |
| `shadcn-registry-item` | **Pas installable** — pas de npm, pas de build, pas de JSX. Mais l'**effet** est reproductible : les dependances du composant sont sur cdnjs. |

## La bonne manoeuvre pour un item shadcn

Ne pas transposer le composant. Lire la ligne du catalogue comme une **specification** :

1. `dependencies` dit quelles librairies charger depuis cdnjs, en version exacte, via une
   balise `<script>` placee avant tout script inline qui s'en sert.
2. `notes` dit les pieges qui restent vrais quel que soit le support — « concu pour fond sombre
   uniquement », « un seul par page », « pas de fallback prefers-reduced-motion ».
3. Reimplementer l'effet en HTML/CSS/JS dans l'artboard. C'est souvent plus court que prevu :
   ces composants sont surtout du React autour d'une idee simple.

Verifier la version exacte sur cdnjs avant d'ecrire le `src` : le chemin est
`https://cdnjs.cloudflare.com/ajax/libs/<lib>/<version exacte>/<fichier>`, et une version
inventee echoue silencieusement comme le reste.

## Ce qui reste utile, quel que soit le support

Les colonnes `notes`, `license` et `last_verified` gardent toute leur valeur. Un artboard n'est
pas une raison d'oublier qu'un effet est concu pour fond sombre, qu'il ne gere pas le mouvement
reduit, ou que sa licence n'a jamais ete verifiee.

Et la regle d'ordre ne change pas : `ui-ux-pro-max` decide du style et de la palette **avant**
qu'on aille chercher un effet dans ce catalogue.

## Recapitulatif des cibles

| Cible | `shadcn-registry-item` | `framer-module` |
|---|---|---|
| Projet Next.js / Vite | installation directe | preflight puis wrapper (`framer-modules.md`) |
| Site Framer | non | `Insert > Code component from URL` |
| Artboard Claude Design / Artifact | effet a reimplementer via cdnjs | impossible |
