# Snippets

Bouts de code reutilisables qui ne justifient pas une entree de registre : un hook,
un wrapper d'accessibilite, un fragment de config Tailwind, un fallback.

## Convention

Un fichier par snippet, nomme `<sujet>.<ext>`, avec un commentaire d'en-tete qui dit
**quand** l'utiliser et **ce qu'il suppose** du projet (Tailwind ? `cn()` ? React 19 ?).

Les snippets ne sont pas indexes par `search.py` — ils sont peu nombreux et se lisent
directement. Si ce dossier depasse une dizaine de fichiers, les promouvoir en entrees
`components.csv` avec un `install` qui pointe vers un vrai registre.

## Amorce utile

`reduced-motion-fallback.tsx` n'existe pas encore mais devrait : la plupart des composants
de registre animes n'honorent pas `prefers-reduced-motion`, et le meme wrapper resservira
a chaque fois.
