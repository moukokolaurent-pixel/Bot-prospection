#!/usr/bin/env python3
"""Recherche dans le catalogue de ressources UI perso.

Usage:
  search.py "particules hero"                 # cherche partout
  search.py --domain component "curseur"      # composants installables seulement
  search.py --domain source "shadcn"          # registries / librairies seulement
  search.py --stack nextjs --list             # tout le catalogue pour un stack
  search.py --tag webgl --json                # filtre par tag, sortie JSON

Sortie par defaut : Markdown, avec la commande d'installation en clair.
"""

import argparse
import csv
import json
import re
import sys
from pathlib import Path

REGISTRY_DIR = Path(__file__).resolve().parent.parent / "registry"

FILES = {
    "component": REGISTRY_DIR / "components.csv",
    "source": REGISTRY_DIR / "sources.csv",
}

# Champs pondérés pour le score de pertinence.
WEIGHTS = {
    "name": 5,
    "id": 4,
    "tags": 3,
    "category": 3,
    "kind": 2,
    "stack": 2,
    "source_id": 2,
    "notes": 1,
}

# Premiers mots qui font d'une chaine une vraie commande shell (cf. render_source).
SHELL_COMMANDS = {"npx", "npm", "pnpm", "yarn", "bun", "bunx", "deno", "git", "curl", "wget", "pip", "python3"}

# Accents -> ASCII, pour que "particules" matche "particules" comme "particules".
ACCENTS = str.maketrans("àâäáãçéèêëíìîïñóòôöõúùûüýÿ", "aaaaaceeeeiiiinooooouuuuyy")


def normalize(text):
    return re.sub(r"[^a-z0-9]+", " ", str(text).lower().translate(ACCENTS)).strip()


def tokenize(text):
    return [t for t in normalize(text).split() if len(t) > 1]


def load(domain):
    """Charge un CSV en liste de dicts, en taguant chaque ligne avec son domaine."""
    path = FILES[domain]
    if not path.exists():
        return []
    with path.open(encoding="utf-8", newline="") as fh:
        rows = list(csv.DictReader(fh))
    for row in rows:
        row["_domain"] = domain
    return rows


def multi(row, field):
    """Lit un champ multi-valeurs separe par des pipes."""
    return [v.strip() for v in (row.get(field) or "").split("|") if v.strip()]


def score(row, query_tokens):
    """Somme ponderee des tokens de la requete trouves dans les champs indexes."""
    if not query_tokens:
        return 1  # pas de requete : tout passe, l'ordre du CSV est conserve
    total = 0
    for field, weight in WEIGHTS.items():
        haystack = normalize(row.get(field, ""))
        if not haystack:
            continue
        for token in query_tokens:
            if token in haystack:
                total += weight
    return total


def matches_filters(row, stack, tag, category):
    if stack and stack not in multi(row, "stack"):
        return False
    if tag and tag not in [normalize(t) for t in multi(row, "tags")]:
        return False
    if category and normalize(category) != normalize(row.get("category", "")):
        return False
    return True


def render_component(row):
    kind = row.get("kind") or "?"
    lines = [
        f"### {row['name']}  `{row['id']}`",
        f"- **Type :** {kind}"
        f" | **Source :** {row.get('source_id') or '—'}"
        f" | **Categorie :** {row.get('category') or '—'}"
        f" | **Licence :** {row.get('license') or 'a verifier'}",
        f"- **Stack :** {', '.join(multi(row, 'stack')) or '—'}",
    ]
    deps = multi(row, "dependencies")
    if deps:
        lines.append(f"- **Dependances :** {', '.join(deps)}")
    if row.get("install"):
        lines.append(f"- **Installer :**\n```bash\n{row['install']}\n```")
    else:
        # Pas de commande shell : ne jamais laisser croire qu'il y en a une.
        lines.append(f"- **Installation :** aucune commande — voir Notes. URL : {row.get('url') or '—'}")
    if row.get("tags"):
        lines.append(f"- **Tags :** {', '.join(multi(row, 'tags'))}")
    if row.get("notes"):
        lines.append(f"- **Notes :** {row['notes']}")
    lines.append(
        f"- **Verifie le :** {row['last_verified']}"
        if row.get("last_verified")
        else "- **Verifie le :** JAMAIS — ressource non verifiee, controler avant usage"
    )
    return "\n".join(lines)


def render_source(row):
    lines = [
        f"### {row['name']}  `{row['id']}`",
        f"- **Type :** {row.get('kind') or '—'} | **Licence :** {row.get('license') or 'a verifier'}",
        f"- **Stack :** {', '.join(multi(row, 'stack')) or '—'}",
        f"- **URL :** {row.get('url') or '—'}",
    ]
    if row.get("index_url"):
        lines.append(f"- **Index a lire avant d'installer :** {row['index_url']}")
    if row.get("install_pattern"):
        pattern = row["install_pattern"]
        # Ne mettre en bloc shell que ce qui est reellement une commande, sinon
        # une consigne du type "inserer dans Framer" se lit comme un truc a coller
        # dans un terminal.
        if pattern.split(" ", 1)[0] in SHELL_COMMANDS:
            lines.append(f"- **Motif d'installation :**\n```bash\n{pattern}\n```")
        else:
            lines.append(f"- **Mode d'emploi :** {pattern}")
    if row.get("tags"):
        lines.append(f"- **Tags :** {', '.join(multi(row, 'tags'))}")
    if row.get("notes"):
        lines.append(f"- **Notes :** {row['notes']}")
    lines.append(
        f"- **Verifie le :** {row['last_verified']}"
        if row.get("last_verified")
        else "- **Verifie le :** JAMAIS — ressource non verifiee, controler avant usage"
    )
    return "\n".join(lines)


RENDERERS = {"component": render_component, "source": render_source}


def main():
    parser = argparse.ArgumentParser(
        description="Recherche dans le catalogue de ressources UI perso.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("query", nargs="?", default="", help="Termes de recherche libres")
    parser.add_argument("--domain", choices=["component", "source", "all"], default="all")
    parser.add_argument("--stack", help="Filtre exact sur un stack (nextjs, react, shadcn, vue...)")
    parser.add_argument("--tag", help="Filtre exact sur un tag")
    parser.add_argument("--category", help="Filtre exact sur une categorie")
    parser.add_argument("--max-results", type=int, default=5, metavar="N")
    parser.add_argument("--list", action="store_true", help="Tout lister (ignore --max-results)")
    parser.add_argument("--json", action="store_true", help="Sortie JSON brute")
    args = parser.parse_args()

    domains = ["component", "source"] if args.domain == "all" else [args.domain]
    tokens = tokenize(args.query)

    hits = []
    for domain in domains:
        for row in load(domain):
            if not matches_filters(row, args.stack, normalize(args.tag) if args.tag else None, args.category):
                continue
            row_score = score(row, tokens)
            if row_score > 0:
                hits.append((row_score, row))

    hits.sort(key=lambda pair: -pair[0])
    if not args.list:
        hits = hits[: args.max_results]

    if args.json:
        payload = [{k: v for k, v in row.items() if k != "_domain"} | {"domain": row["_domain"], "score": s}
                   for s, row in hits]
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0

    print("## Ressources UI perso")
    print(f"**Domaine :** {args.domain} | **Requete :** {args.query or '(aucune)'} | **Trouve :** {len(hits)}")
    if not hits:
        print("\nAucun resultat. Elargir la requete, ou verifier que la ressource a bien ete ajoutee")
        print("au catalogue (voir references/ajouter-une-ressource.md).")
        return 0
    for _, row in hits:
        print()
        print(RENDERERS[row["_domain"]](row))
    return 0


if __name__ == "__main__":
    sys.exit(main())
