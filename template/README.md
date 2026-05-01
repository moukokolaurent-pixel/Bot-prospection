# `template/` — Maquette personnalisable (Module 1)

Site preview servi par le Worker (Module 3) pour chaque prospect. Vite + React 18 + TypeScript, dépendances strictement minimales (uniquement `react`, `react-dom`).

## Commandes

```bash
cd template
npm install
npm run dev        # http://localhost:5173 — substitue PROSPECT_DATA depuis prospect-data.example.json
npm run build      # produit dist/ — index.html garde __PROSPECT_DATA__ intact
npm run preview    # sert dist/ sur http://localhost:4173 (le Worker injectera côté prod)
```

## Comment fonctionne l'injection des données

`index.html` contient une seule ligne « magique » :

```html
<script>window.PROSPECT_DATA = __PROSPECT_DATA__;</script>
```

Le placeholder `__PROSPECT_DATA__` est substitué :

| Phase | Acteur | Source |
|-------|--------|--------|
| `npm run dev` | plugin Vite (`vite.config.ts`) | `prospect-data.example.json` |
| `npm run build` | _personne_ — placeholder conservé tel quel | — |
| Production | **Worker Cloudflare** (Module 3) | row D1 `prospects.data_json` |

Le bundle React lit `window.PROSPECT_DATA` au démarrage (`src/main.tsx`), valide les champs requis, fixe le `<title>` + meta description dynamiquement, puis monte l'app dans `<ProspectProvider>`. Tous les composants consomment ensuite via `useProspect()`.

## Structure

```
template/
├── index.html                       # placeholder __PROSPECT_DATA__
├── prospect-data.example.json       # jeu fictif pour `npm run dev`
├── public/
│   └── hero.webp                    # hero fallback (96 KB) si photo_hero_url absent
├── src/
│   ├── types.ts                     # ProspectData, AvisGoogle, augmentation Window
│   ├── main.tsx                     # entry point, validation, title/meta dynamiques
│   ├── styles.css                   # design system (porté tel quel depuis le canvas)
│   ├── icons.tsx                    # icônes Lucide-style
│   ├── shared.tsx                   # ProspectContext + Nav + Footer + MaquetteBanner + hooks
│   ├── hero.tsx                     # HeroSplit + HeroBackground + DevisExpressGlass
│   ├── sections.tsx                 # Services + Estimateur + Process (générique)
│   ├── sections2.tsx                # Realisations + Testimonials + Zone + FAQ + Certifs
│   ├── contact.tsx                  # ContactCTA + ContactForm
│   └── app.tsx                      # composition de la page
├── tsconfig.json                    # strict + verbatimModuleSyntax + noUnusedLocals
└── vite.config.ts                   # plugin de substitution dev
```

## Variables prospect (rappel)

Voir `../template-vars.md` pour le mapping exhaustif. En résumé :

- **Identité** : `nom_entreprise`, `ville_principale`, `code_postal`, `departement_label`, `adresse_complete`, `telephone_display`, `telephone_e164`, `email`
- **Réputation** : `note_google`, `nombre_avis`, `avis_google[]`
- **Visuel** : `photo_hero_url` (fallback `/hero.webp`)

## Logique conditionnelle

| Condition | Conséquence |
|-----------|-------------|
| `avis_google.length < 3` | `<Testimonials/>` retourne `null` |
| `note_google` indéfini | la 4e stat hero `note/5 · avis Google` est masquée |
| `email` vide | les lignes E-mail du Footer et de ContactCTA sont supprimées |
| `photo_hero_url` indéfini ou `null` | `<HeroBackground/>` utilise `/hero.webp` |
| `ville_principale` ∉ liste Zone | `Saint-Clément` reste HQ par défaut |

## Bandeau Maquette

Composant `<MaquetteBanner/>` rendu **avant** `<TickerBar/>` :

> Maquette personnalisée pour {nom_entreprise} · préparée par Axelia Design · démo sans engagement → axelia-design.fr

Style : barre fine `var(--accent)` / `var(--accent-deep)`, JetBrains Mono 11.5 px, padding 8 px 0.

## Suppressions par rapport au canvas source

- Tout le système `tweaks` (panel d'édition Hero/Density/Glass) — `tweaks.jsx`, `tweaks-panel.jsx`, état `tweaks` dans `app.tsx`, effet `glass-tweak`, `<AppTweaks/>`.
- `window.parent.postMessage(...)` du mode édition (`app.jsx:16`).
- Variantes hero `HeroFloat` et `HeroEditorial` — il ne reste que `HeroSplit`.
- Les `Object.assign(window, {...})` partout — remplacés par des exports nommés ES modules.

## Image hero

Le canvas source fournit un JPEG 4608×3072 (1.2 MB). On le compresse en WebP 1920×1280 qualité 78 (≈ 96 KB). Pour le re-générer après changement :

```bash
python3 - <<'PY'
from PIL import Image
img = Image.open("/path/to/hero-template.jpg")
img = img.resize((1920, round(img.height*1920/img.width)), Image.LANCZOS)
img.save("public/hero.webp", "WEBP", quality=78, method=6)
PY
```

(Pillow doit être installé : `pip install Pillow`.)
