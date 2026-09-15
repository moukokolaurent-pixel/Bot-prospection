#!/usr/bin/env python3
"""Dit si un module Framer peut fonctionner hors de Framer, et pourquoi.

    python3 framer-preflight.py "https://framer.com/m/eyes-ZYGv.js@FfIIKDynKRXjqznTXtaR"

A lancer depuis VOTRE machine : les sessions Claude Code distantes ont
framer.com refuse par leur politique reseau, ce script y renvoie toujours
INJOIGNABLE.

Ce qu'il regarde, dans l'ordre ou ca casse :

1. L'URL repond-elle ?
2. Les imports sont-ils tous resolus en URL absolue ? Un specificateur nu
   ("react", "framer") ne se resout pas dans un navigateur sans import map :
   le module ne chargera pas tel quel.
3. React apparait-il par plusieurs chemins ? Deux instances de React = les
   hooks lancent "Invalid hook call" et rien ne s'affiche.
4. Le module utilise-t-il les property controls Framer ? Ils ne servent que
   dans la toile Framer ; hors de Framer, les props se passent a la main.
"""

import json
import re
import sys
import urllib.error
import urllib.request

BARE_ALLOWED_PREFIXES = ("http://", "https://", "./", "../", "/", "data:", "blob:")


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "ui-perso-preflight/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status, resp.headers.get("content-type", ""), resp.read().decode("utf-8", "replace")


def find_imports(source):
    """Tous les specificateurs de module: import ... from "x", import "x", import("x")."""
    specs = set()
    specs.update(re.findall(r'\bfrom\s*["\']([^"\']+)["\']', source))
    specs.update(re.findall(r'\bimport\s*["\']([^"\']+)["\']', source))
    specs.update(re.findall(r'\bimport\s*\(\s*["\']([^"\']+)["\']', source))
    specs.update(re.findall(r'\bexport\s+\*\s+from\s*["\']([^"\']+)["\']', source))
    return sorted(specs)


def main(argv):
    if len(argv) != 2:
        print(__doc__)
        return 2
    url = argv[1]

    print(f"Module : {url}\n")

    try:
        status, ctype, source = fetch(url)
    except urllib.error.HTTPError as exc:
        print(f"VERDICT : INJOIGNABLE — HTTP {exc.code}")
        print("L'URL ne repond pas. Verifier le nom et le hash de version.")
        return 1
    except Exception as exc:  # reseau, proxy, DNS, TLS
        print(f"VERDICT : INJOIGNABLE — {type(exc).__name__}: {exc}")
        if "403" in str(exc) or "Tunnel" in str(exc):
            print("Un proxy a refuse la connexion. Depuis une session Claude Code distante")
            print("c'est attendu pour framer.com : relancer depuis votre machine.")
        else:
            print("Verifier la connexion reseau et l'URL.")
        return 1

    print(f"1. Reponse ............. HTTP {status}, {len(source)} octets, {ctype or 'type inconnu'}")

    specs = find_imports(source)
    bare = [s for s in specs if not s.startswith(BARE_ALLOWED_PREFIXES)]
    remote = [s for s in specs if s.startswith(("http://", "https://"))]

    print(f"2. Imports ............. {len(specs)} au total, {len(remote)} en URL absolue, {len(bare)} nus")
    for s in bare:
        print(f"     NU  {s}")
    for s in remote[:8]:
        print(f"     URL {s}")
    if len(remote) > 8:
        print(f"     ... et {len(remote) - 8} autres")

    react_sources = sorted({s for s in specs if re.search(r"(^|/)react(@|/|$|\.js)", s)})
    print(f"3. Sources de React .... {len(react_sources)}")
    for s in react_sources:
        print(f"     {s}")

    controls = bool(re.search(r"addPropertyControls|ControlType\.", source))
    print(f"4. Property controls ... {'oui' if controls else 'non'}")

    print()
    blocking = []
    if bare:
        blocking.append(
            f"{len(bare)} import(s) nu(s) : le navigateur ne sait pas les resoudre sans import map."
        )
    if len(react_sources) > 1:
        blocking.append(
            f"{len(react_sources)} sources de React : deux instances = 'Invalid hook call', rien ne rend."
        )

    if blocking:
        print("VERDICT : NE FONCTIONNERA PAS TEL QUEL hors de Framer")
        for b in blocking:
            print(f"  - {b}")
        print("\n  Dans Framer : aucun probleme, le runtime resout tout ca.")
        print("  Hors de Framer : reimplementer l'effet plutot que de forcer l'import.")
    else:
        print("VERDICT : CHARGEABLE hors de Framer")
        print("  Tous les imports sont resolus en URL absolue, une seule source de React.")
        print("  Utiliser snippets/framer-module-in-next.tsx pour le monter cote client.")
        print("  Restent : la CSP (script-src vers les domaines ci-dessus), l'absence de")
        print("  SSR, et le fait que l'URL peut disparaitre sans preavis.")
    if controls:
        print("\n  Note : le module declare des property controls. Hors de Framer ils sont")
        print("  inertes — lire leur definition dans la source pour connaitre les props et")
        print("  leurs valeurs par defaut, puis les passer a la main.")

    if "--json" in argv:
        print(json.dumps({"url": url, "bare": bare, "remote": remote,
                          "react_sources": react_sources, "controls": controls}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
