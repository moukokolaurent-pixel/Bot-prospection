# `template-vars.md` — Cartographie des variables du template

> **But** : recenser *toute* valeur en dur du template-source qui doit être personnalisée par prospect, et la mapper sur le schéma `ProspectData` (brief §2.3).
> **Méthode** : balayage des 11 fichiers source ; chaque occurrence est listée avec `fichier:ligne` pour pouvoir patcher chirurgicalement lors de la migration TSX.

---

## 1. Schéma `ProspectData` retenu

Identique au brief §2.4, recopié ici pour référence (typage TypeScript final dans `/template/src/types.ts`) :

```ts
export interface ProspectData {
  nom_entreprise: string;       // ex. "SSUN ELEC"
  ville_principale: string;     // ex. "Montpellier"
  code_postal: string;          // ex. "34980"
  departement_label: string;    // ex. "Hérault (34)"
  adresse_complete: string;     // ex. "Saint-Clément-de-Rivière · 34980 Hérault"
  telephone_display: string;    // ex. "06 02 40 91 47"
  telephone_e164: string;       // ex. "+33602409147"
  email: string;                // ex. "ssun.elec@gmail.com"
  note_google?: number;         // ex. 4.9
  nombre_avis?: number;         // ex. 47
  photo_hero_url?: string;      // URL GMB ou fallback /hero.webp
  avis_google: AvisGoogle[];    // 0..5 reviews
}
export interface AvisGoogle {
  author: string;
  rating: number;
  text: string;
  role: string;                 // toujours "Client Google"
}
```

Toute la lecture côté composants passera par un `useProspect()` exposé via `<ProspectProvider>` (cf. brief §2.5).

---

## 2. Mapping Google Places → `ProspectData`

| Champ ProspectData     | Source Places API (New)                                    | Notes / fallback |
|------------------------|------------------------------------------------------------|------------------|
| `nom_entreprise`       | `displayName.text`                                         | upper-case respecté tel quel |
| `ville_principale`     | extrait `formattedAddress` (token avant le code postal)    | si extraction échoue → ville GMB `addressComponents` (locality) |
| `code_postal`          | regex `/\b\d{5}\b/` sur `formattedAddress`                 | requis pour calcul département |
| `departement_label`    | calculé depuis `code_postal` (préfixe `34` → "Hérault (34)") | hard-codé `"Hérault (34)"` tant que la zone reste 34 |
| `adresse_complete`     | `formattedAddress` brute                                   | nettoyer suffixe `, France` si présent |
| `telephone_display`    | `nationalPhoneNumber`                                      | si absent → tenter `internationalPhoneNumber` reformaté |
| `telephone_e164`       | `internationalPhoneNumber` sans espaces                    | requis pour les `tel:` |
| `email`                | scrap léger sur la page `websiteUri` → fallback vide       | si vide, dashboard demande saisie manuelle avant envoi |
| `note_google`          | `rating`                                                   | optionnel |
| `nombre_avis`          | `userRatingCount`                                          | optionnel |
| `photo_hero_url`       | `photos[0]` (GMB `Place Photo`)                            | fallback `/hero.webp` |
| `avis_google`          | `reviews[]` (jusqu'à 5)                                    | mapping `{author: authorAttribution.displayName, rating, text: text.text, role: "Client Google"}` |

> **Champ Places API** à renseigner dans `X-Goog-FieldMask` :
> `places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri,places.photos`
> puis Place Details avec `id,displayName,formattedAddress,nationalPhoneNumber,internationalPhoneNumber,rating,userRatingCount,websiteUri,photos,reviews`.

---

## 3. Inventaire des valeurs en dur (prospect-spécifiques)

Chaque entrée indique : **fichier** · **ligne(s)** · **valeur courante** · **variable cible** · **action de migration**.

### 3.1 `index.html`

| # | Ligne | Valeur en dur | Variable | Action |
|---|------:|---------------|----------|--------|
| 1 | 6 | `<title>SSUN ELEC — Électricien certifié à Montpellier · Dépannage, domotique & rénovation</title>` | `nom_entreprise` + `ville_principale` | titre laissé en placeholder neutre dans le HTML ; **set dynamique dans `main.tsx`** : `document.title = `${data.nom_entreprise} — Électricien à ${data.ville_principale}`` |
| 2 | 7 | `<meta name="description" content="SSUN ELEC, votre artisan électricien à Montpellier et dans l'Hérault. …">` | `nom_entreprise` + `ville_principale` + `departement_label` | idem : ré-injection dynamique dans `main.tsx` via `document.querySelector('meta[name=description]')`. Template : `${nom} à ${ville}, ${dept}. Dépannage, mise aux normes, domotique, bornes de recharge.` |

### 3.2 `src/shared.jsx`

| # | Ligne | Valeur en dur | Variable | Action |
|---|------:|---------------|----------|--------|
| 3 | 62 | `<span>SSUN ELEC</span>` (logo header) | `nom_entreprise` | `{data.nom_entreprise}` |
| 4 | 73 | `Disponible · Intervention sous 2 h sur Montpellier et l'Hérault` (TickerBar) | `ville_principale` + `departement_label` | template : `Disponible · Intervention sous 2 h sur ${ville_principale} et l'${departement_label.replace(/\s\(\d+\)$/, '')}` |
| 5 | 76 | `href="tel:+33602409147"` + `06 02 40 91 47` (TickerBar) | `telephone_e164` + `telephone_display` | `tel:${telephone_e164}` + `{telephone_display}` |
| 6 | 141-144 | `href="tel:+33602409147"` + `06 02 40 91 47` (Nav phone) | `telephone_e164` + `telephone_display` | idem |
| 7 | 168 | `<span>SSUN ELEC</span>` (logo footer) | `nom_entreprise` | `{data.nom_entreprise}` |
| 8 | 170-172 | « Votre artisan électricien à **Saint-Clément-de-Rivière**. … partout dans **l'Hérault**. » | `ville_principale` + `departement_label` | template : `Votre artisan électricien à ${ville_principale}. Dépannage, mise aux normes, domotique, bornes de recharge — partout dans ${departement_label}.` |
| 9 | 188-194 | Liste « Zone » footer : Montpellier, Saint-Clément-de-Rivière, Béziers, Castelnau-le-Lez, Lattes · Pérols, Hérault (34) | **GÉNÉRIQUE** (zone Hérault), juste `Hérault (34)` ↔ `departement_label` | la liste reste **fixe** (cohérent brief §2.3 « Zone d'intervention : la liste des 7 villes du composant Zone reste générique ») ; seule la dernière ligne `Hérault (34)` ↔ `{departement_label}` |
| 10 | 199 | `<a href="tel:+33602409147">06 02 40 91 47</a>` (footer contact) | `telephone_e164` + `telephone_display` | `tel:${telephone_e164}` + `{telephone_display}` |
| 11 | 200 | `<a href="mailto:ssun.elec@gmail.com">ssun.elec@gmail.com</a>` (footer contact) | `email` | `mailto:${email}` + `{email}` ; **si email vide → masquer la ligne entière** |
| 12 | 202 | `Saint-Clément-de-Rivière<br />34980 Hérault` (footer adresse) | `adresse_complete` | rendu sur 2 lignes : split sur ` · ` → `${ville}<br/>${cp} ${dept_court}` (fallback : `{adresse_complete}` brut) |
| 13 | 207 | `© 2026 SSUN ELEC — Artisan électricien · Hérault` | `nom_entreprise` + `departement_label` | template : `© ${new Date().getFullYear()} ${nom_entreprise} — Artisan électricien · ${departement_label.replace(/\s\(\d+\)$/, '')}` |
| 14 | 266 | `<a href="tel:+33602409147">` (MobileBar) | `telephone_e164` | `tel:${telephone_e164}` |

### 3.3 `src/hero.jsx`

| # | Ligne | Valeur en dur | Variable | Action |
|---|------:|---------------|----------|--------|
| 15 | 13 | `<img src="assets/hero-template.jpg" />` (HeroBackground) | `photo_hero_url` | `<img src={photo_hero_url ?? '/hero.webp'} />` ; le fichier `/template/public/hero.webp` (compressé < 200 KB) sert de fallback |
| 16 | 248 | `Montpellier · Hérault (34)` (badge HeroSplit) | `ville_principale` + `departement_label` | `${ville_principale} · ${departement_label}` |
| 17 | 252-254 | `Votre électricien.\n<span>à Montpellier</span>\n<span>Sous 2 h.</span>` (H1 HeroSplit) | `ville_principale` | `<h1>Votre électricien. <br/><span>à {ville_principale}</span> …</h1>` |
| 18 | 258 | `Partout dans l'Hérault.` (sous-titre HeroSplit) | `departement_label` | `Partout dans ${departement_label}.` |
| 19 | 266 | `<a href="tel:+33602409147">` + `06 02 40 91 47` (HeroSplit CTA) | `telephone_e164` + `telephone_display` | `tel:${telephone_e164}` + `{telephone_display}` |
| 20 | 271-276 | Stats hero `[{v:"117",l:"chantiers livrés"},{v:"100%",l:"satisfaction client"},{v:"<2 h",l:"intervention urgence"},{v:"4.9/5",l:"avis Google"}]` | **REMPLACEMENT FORFAITAIRE** par la liste imposée brief §2.3 | nouvelle liste : `[{v:"60s",l:"devis chiffré"},{v:"2 ans",l:"garantie pièces & MO"},{v:"<2 h",l:"intervention urgence"},{v:`${note_google}/5`,l:"avis Google"}]`. **La 4e entrée est conditionnelle** : pushée seulement si `note_google` est défini. |
| 21 | 300-329 | composant `HeroFloat` complet | — | **À SUPPRIMER** (brief §2.2) |
| 22 | 332-381 | composant `HeroEditorial` complet | — | **À SUPPRIMER** (brief §2.2) |
| 23 | 383-389 | `function Hero()` switch sur `tweaks.heroVariant` | — | **simplifier** : `function Hero(){ return <HeroSplit/>; }` |

### 3.4 `src/sections.jsx`

| # | Ligne | Valeur en dur | Variable | Action |
|---|------:|---------------|----------|--------|
| 24 | 7-43 | `services[]` (6 prestations) | — | **GÉNÉRIQUE — INCHANGÉ** |
| 25 | 354-356 | `steps[]` (3 étapes process) | — | **GÉNÉRIQUE — INCHANGÉ** |

> Aucune valeur prospect-spécifique dans ce fichier. Sections « Services » + « Process » + « Estimateur » entièrement réutilisables.

### 3.5 `src/sections2.jsx`

| # | Ligne | Valeur en dur | Variable | Action |
|---|------:|---------------|----------|--------|
| 26 | 7-27 | `cases[]` (4 réalisations) — chaque entrée a un champ `lieu` qui contient une ville (« Castelnau-le-Lez · T4 · 95 m² ») | — | **modification ciblée** brief §2.3 : retirer la ville. Règle : prendre la sous-chaîne après le premier ` · `. Ex. `Castelnau-le-Lez · T4 · 95 m²` → `T4 · 95 m²` ; `Montpellier centre · Maison · 140 m²` → `Maison · 140 m²` ; `Pérols · Maison individuelle` → `Maison individuelle` ; `Lattes · Appartement neuf` → `Appartement neuf`. |
| 27 | 38 (titre Realisations) | — | — | **AJOUT brief §2.3** : sous le `<SecHead>`, insérer `<p style="font-size:11px;color:var(--muted);font-style:italic">Exemples de mise en page · vos vraies réalisations remplaceront ce contenu</p>` |
| 28 | 179-189 | `items[]` (5 témoignages hardcodés Lucas, Thibault, Marine, Olivier, Sophie) | `avis_google[]` | **REMPLACEMENT** : `const items = data.avis_google.map(a => ({author:a.author, role:a.role, rating:a.rating, text:a.text}));`. **Si `items.length < 3` → la section entière n'est pas rendue** (brief §2.3 : « Si moins de 3 avis disponibles, la section "Témoignages" est masquée »). |
| 29 | 205 | `sub="Avis Google + Pages Jaunes, vérifiés. Note moyenne 4,9 / 5 sur 47 avis."` | `note_google` + `nombre_avis` | template : `Avis Google vérifiés. Note moyenne ${note_google.toLocaleString('fr-FR')} / 5 sur ${nombre_avis} avis.` |
| 30 | 209 | `4,9 / 5 · 47 avis` (badge inline) | `note_google` + `nombre_avis` | `${note_google.toLocaleString('fr-FR')} / 5 · ${nombre_avis} avis` |
| 31 | 265-272 | `cities[]` (7 villes : Montpellier, Saint-Clément, Castelnau, Lattes, Pérols, Béziers, Sète) avec `Saint-Clément` marqué `hq:true` | `ville_principale` (toggle hq) | **liste fixe** brief §2.3 ; bascule du `hq:true` vers la ville qui matche `ville_principale` (comparaison lowercase + accent-insensitive). Si `ville_principale` n'apparaît pas dans la liste → on garde `Saint-Clément` HQ par défaut. |
| 32 | 292 | `Basés à Saint-Clément-de-Rivière, nous intervenons à Montpellier, Béziers, Sète…` | `ville_principale` | template : `Basés à ${ville_principale}, nous intervenons à Montpellier, Béziers, Sète, et toutes les communes de l'agglomération. …` |
| 33 | 384 | `117 chantiers · 7 villes` (footer card carte) | — | **GARDER GÉNÉRIQUE** (chiffre symbolique partagé). À confirmer §6 ci-dessous. |
| 34 | 398-412 | `items[]` FAQ (7 questions) | — | **GÉNÉRIQUE — INCHANGÉ** |
| 35 | 432 | `<a href="tel:+33602409147">06 02 40 91 47</a>` (CTA latéral FAQ) | `telephone_e164` + `telephone_display` | `tel:${telephone_e164}` + `{telephone_display}` |
| 36 | 481 | `Certifs.items` (Qualifelec, IRVE, Consuel, …) | — | **GÉNÉRIQUE — INCHANGÉ** |

### 3.6 `src/contact.jsx`

| # | Ligne | Valeur en dur | Variable | Action |
|---|------:|---------------|----------|--------|
| 37 | 34 | `{ icon: IconPhone, label: "Appel direct", value: "06 02 40 91 47", href: "tel:+33602409147" }` | `telephone_display` + `telephone_e164` | `value: telephone_display, href: \`tel:${telephone_e164}\`` |
| 38 | 35 | `{ icon: IconMail, label: "E-mail", value: "ssun.elec@gmail.com", href: "mailto:ssun.elec@gmail.com" }` | `email` | `value: email, href: \`mailto:${email}\`` ; **si email vide → masquer cette ligne du tableau** |
| 39 | 36 | `{ icon: IconMapPin, label: "Adresse", value: "Saint-Clément-de-Rivière · 34980 Hérault" }` | `adresse_complete` | `value: adresse_complete` |
| 40 | 37 | `{ icon: IconClock, label: "Horaires", value: "Lun–Ven · 8h–19h · Samedi 9h–18h" }` | — | **GÉNÉRIQUE — INCHANGÉ** (brief silent ; à confirmer §6) |

### 3.7 `src/icons.jsx`

> Aucune valeur prospect-spécifique. Pure librairie d'icônes, recopiée telle quelle.

### 3.8 `src/app.jsx`

| # | Ligne | Valeur en dur | Variable | Action |
|---|------:|---------------|----------|--------|
| — | 3-7, 10-38 | `TWEAK_DEFAULTS`, `tweaks` state, effect glass+density, `<AppTweaks/>` | — | **À SUPPRIMER ENTIÈREMENT** (brief §2.2) |
| — | 16 | `window.parent.postMessage({ type: "__edit_mode_set_keys", … })` | — | **À SUPPRIMER** (brief §2.2) |
| — | 41 | `<AppCtx.Provider>` | — | remplacé par `<ProspectProvider value={data}>` |
| — | 44 | `<Hero />` | — | conserve le composant simplifié |
| — | 58 | `<AppTweaks />` | — | **À SUPPRIMER** |

### 3.9 `src/tweaks.jsx` + `src/tweaks-panel.jsx`

> **À SUPPRIMER intégralement** (brief §2.2). Aucun port vers TSX.

### 3.10 `styles.css`

> Aucune valeur prospect-spécifique. Recopié intégralement vers `/template/src/styles.css` (brief §2.2).

---

## 4. Composant **NOUVEAU** : `<MaquetteBanner/>` (brief §2.3)

| Détail | Spécification |
|--------|---------------|
| Position dans le DOM | Tout en haut, **avant** `<TickerBar/>` (donc avant `<Nav/>` ouvrant) |
| Largeur | 100 % viewport |
| Fond | `var(--accent)` |
| Couleur texte | `var(--accent-deep)` |
| Police | `'JetBrains Mono', monospace` 11.5 px |
| Padding | `8px 0` |
| Texte centré | `Maquette personnalisée pour {nom_entreprise} · préparée par Axelia Design · démo sans engagement` |
| Lien à droite | `→ axelia-design.fr` (color: `inherit`, opacity 0.7), `href="https://axelia-design.fr"`, `target="_blank" rel="noopener"` |

Layout : `position: relative; display:flex; justify-content:center; align-items:center; gap:24px` ; le lien est positionné en absolute à droite (`position:absolute; right:24px`).

---

## 5. Logique conditionnelle de rendu

| Condition | Action |
|-----------|--------|
| `avis_google.length < 3` | `<Testimonials/>` n'est pas monté (return `null`) |
| `note_google` indéfini | la 4e stat hero `{v:`${note}/5`,l:"avis Google"}` est filtrée du tableau ; on rend les 3 premières stats |
| `email` vide | dans le footer (#11) **et** dans `ContactCTA` (#38), la ligne email du tableau est filtrée (`.filter(it => it.label !== 'E-mail' || data.email)`) |
| `photo_hero_url` indéfini | `<img>` du `HeroBackground` utilise `/hero.webp` (asset compressé) |
| `ville_principale` ∉ `cities[]` (Zone) | `Saint-Clément` reste HQ par défaut |

---

## 6. Points à confirmer avec Laurent avant code

> **Bloquants potentiels**, je préfère poser la question maintenant plutôt que de coder une mauvaise hypothèse :

1. **Stat « 117 chantiers · 7 villes »** dans la carte interactive `Zone` (sections2.jsx:384). Pas mentionnée dans le brief. **Hypothèse retenue** : on garde générique (chiffre vague, pas un compteur chantier réel). OK ?
2. **Horaires** « Lun–Ven · 8h–19h · Samedi 9h–18h » (Footer + ContactCTA). Pas de champ dédié dans `ProspectData`. **Hypothèse retenue** : on les garde fixes (rare que la GMB API les renvoie sous une forme exploitable proprement). OK ou tu préfères que je les masque entièrement ?
3. **Témoignage** : si `avis_google.length` est `>= 3` mais `< 5`, le carousel auto-rotate-t-il sur 3-4 items (`setInterval` actuel = `i % items.length`) ou veux-tu un mode statique en dessous d'un certain seuil ? **Hypothèse retenue** : carousel actif dès `>= 3`, identique au comportement actuel.
4. **Bandeau Maquette** : le lien `→ axelia-design.fr` doit-il pointer en plain text vers `https://axelia-design.fr` ou vers un sous-chemin (`/preview-electricien` par ex.) pour pouvoir tracker les conversions venant des maquettes ? **Hypothèse retenue** : `https://axelia-design.fr` simple, sans paramètre UTM.
5. **Stats hero forfaitaires** : la 4e stat « avis Google » devient `${note_google}/5` (ex. « 4.9/5 »). Tu veux y adjoindre le `nombre_avis` (« 4.9/5 · 47 avis ») dans le label, ou conserver le label minimaliste « avis Google » comme dans le brief ? **Hypothèse retenue** : strict respect brief, label = `"avis Google"`.

---

## 7. Récap quantitatif

- **40 occurrences** de valeurs en dur prospect-spécifiques identifiées (cf. tableaux §3).
- **2 composants à supprimer** (`HeroFloat`, `HeroEditorial`).
- **2 fichiers entiers à supprimer** (`tweaks.jsx`, `tweaks-panel.jsx`).
- **1 nouveau composant** (`<MaquetteBanner/>`).
- **5 conditions de rendu** (§5).
- **5 questions ouvertes** (§6).

---

> **Statut** : pré-étape Module 1 terminée. **J'attends ta validation** sur les 5 questions §6 avant de démarrer le portage Vite + le scaffolding du dossier `/template/`.
