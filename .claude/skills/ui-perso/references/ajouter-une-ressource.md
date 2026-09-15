# Ajouter une ressource au catalogue

## Choisir le bon fichier

- **Un registre / une librairie entiere** → `registry/sources.csv`
- **Un composant precis que vous avez regarde et retenu** → `registry/components.csv`

Les deux ne sont pas exclusifs : on catalogue le registre une fois, puis chaque item interessant au fur et a mesure.

## Colonnes — `sources.csv`

| Colonne | Contenu | Exemple |
|---|---|---|
| `id` | slug unique, minuscules, tirets | `vengeance-ui` |
| `name` | nom lisible | `VengeanceUI` |
| `kind` | `shadcn-registry`, `npm-package`, `css-lib`, `inspiration`, `mcp` | `shadcn-registry` |
| `url` | page humaine (dépôt, site) | `https://github.com/...` |
| `index_url` | index machine listant les items — **la colonne la plus utile** | `.../public/r/registry.json` |
| `stack` | stacks compatibles, separes par `\|` | `nextjs\|react\|shadcn` |
| `install_pattern` | commande avec `{name}` en placeholder | `npx shadcn@latest add .../{name}.json` |
| `tags` | francais **et** anglais, separes par `\|` | `animation\|webgl\|hero` |
| `license` | lue dans le depot, pas devinee | `MIT` |
| `notes` | nombre d'items, pieges, ce qu'il faut savoir | voir ci-dessous |
| `added` / `last_verified` | `AAAA-MM-JJ` | `2026-09-15` |

## Colonnes — `components.csv`

Memes conventions, plus :

| Colonne | Contenu |
|---|---|
| `kind` | `shadcn-registry-item` ou `framer-module` — decide de la procedure d'installation |
| `source_id` | `id` de la ligne correspondante dans `sources.csv` |
| `category` | `hero-effect`, `navigation`, `form`, `data-display`, `background`, `scroll-effect`, `bento-grid`... |
| `url` | l'URL de la ressource elle-meme, toujours renseignee |
| `install` | la commande **complete et exacte**, ou **vide** si la ressource ne s'installe pas par commande |
| `dependencies` | dependances reelles, lues dans le JSON du registre — jamais devinees |

**`install` vide n'est pas un oubli, c'est une information.** `search.py` affiche alors
« Installation : aucune commande — voir Notes ». Une ressource Framer, un lien d'inspiration
ou un composant a recopier a la main n'ont pas de commande : laisser le champ vide plutot que
d'inventer un `npx` autour de l'`url`.

**`last_verified` vide n'est pas un oubli non plus.** Il signale que le contenu n'a jamais ete
lu, et `search.py` l'affiche en toutes lettres (« Verifie le : JAMAIS »). Ne le remplir qu'apres
avoir reellement ouvert la ressource.

## Trouver le nom exact d'un item

Ne pas deviner l'URL. Lire l'index du registre :

```bash
curl -sS https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/registry.json \
  | python3 -c "import json,sys; [print(i['name'], '|', ','.join(i.get('dependencies',[]))) for i in json.load(sys.stdin)]"
```

Puis verifier que l'item repond bien avant de le cataloguer :

```bash
curl -sS -o /dev/null -w "%{http_code}\n" "<url-de-l-item>.json"
```

## Regles d'ecriture des `notes`

Le champ `notes` est lu par l'agent au moment de decider. Il doit contenir **ce qui coince**, pas ce qui brille :

- ✅ « Lourd : un seul par page, reserver au hero. Pas de fallback prefers-reduced-motion. »
- ✅ « Ecrase `components/ui/button.tsx` si deja present. »
- ❌ « Superbe effet de particules, tres moderne. »

Le catalogue n'a pas besoin d'etre convaincu : il a besoin d'etre prevenu.

## Verification periodique

Les URL de registre cassent. Pour re-verifier tout le catalogue :

```bash
python3 .claude/skills/ui-perso/scripts/search.py --list --json \
  | python3 -c "
import json,sys,urllib.request
for r in json.load(sys.stdin):
    url = r.get('index_url') or r.get('url') or ''
    inst = r.get('install','')
    target = url if url else inst.split()[-1] if inst else ''
    if not target.startswith('http'): continue
    try:
        code = urllib.request.urlopen(target, timeout=10).status
    except Exception as e:
        code = repr(e)
    print(r['id'], '->', code)
"
```

Mettre `last_verified` a jour sur les lignes qui repondent, corriger ou supprimer les autres.

## CSV — pieges d'ecriture

- Toujours entourer `notes` de guillemets doubles (elle contient des virgules).
- Ne pas mettre de virgule dans les champs non quotes.
- Separateur multi-valeurs : `|`, jamais une virgule.
- Eviter les accents dans `id` et `tags` — la recherche les normalise, mais les garder ASCII evite les surprises de encodage.
